import { Component, OnInit, EventEmitter, Output } from 'angular2/core';
import { PredictionPipe } from './prediction.pipe.ts';
import { StopService } from "./stop.service.ts";
import { MapService } from "../map/map.service.ts";
import { StopPrediction } from '../interface';
import { Observable } from "rxjs/Rx";
import { HTTP_PROVIDERS } from "angular2/http";
import { Geolocation } from 'ionic-native';
import { StopTitlePipe } from "./stop-title.pipe";


@Component({
  selector: 'stops',
  templateUrl: 'build/pages/map/stops/stops.html',
  providers: [StopService, HTTP_PROVIDERS],
  pipes: [PredictionPipe, StopTitlePipe]
})
export class StopsComponent implements OnInit {
  routes: Array;
  pos: any;
  closestStop: StopPrediction;
  @Output() routeChange = new EventEmitter();
  currentLocation: Object = { lat: '', lng: '' };
  prediction$: Observable<any>;

  constructor(private _stopService: StopService,
              private _mapService: MapService) {
  }

  ngOnInit() {
    Geolocation.watchPosition()
        .distinctUntilChanged()
        .throttleTime(500)
        .subscribe(location => {
          this.currentLocation = {
            lat: location.coords.latitude,
            lng: location.coords.longitude
          };
          this._mapService.setSelfMarker(this.currentLocation);
        });


  }

  // Click button, then ask for prediction and draw stops
  showNearbyStops() {
    this._getPredictionStream(() => {
      this._savePrediction(this.prediction$);
      this._drawStopInfo(this.prediction$);
      this._mapService.clearLine();
    })
  }

  showClosestStop() {
    this._getPredictionStream(() => {
      this._getClosestLocation(this.prediction$, () => {
        this.routes = [{
          title: this.closestStop.routeTitle,
          stops: [this.closestStop]
        }];
        this._mapService.clearLine();
        this._drawStopInfo(Observable.of(this.closestStop));
      });
    })
  }

  // Zoom to the point on click
  focusStop(lat, lng) {
    this._mapService.setMapCenter({ lat: +lat, lng: +lng });
  }

  // Notify parent component to draw route on map
  showRoute(route) {
    document.querySelector('select').value = route.stops[0].routeTag;
    const routeTag = route.stops[0].routeTag;
    this.routeChange.emit(routeTag);
  }

  // ===== Private functions =====

  // find near by stops, and share the stream
  private _getPredictionStream(callback) {
    this._stopService.findStops(this.currentLocation)
        .subscribe(data => {
          this.prediction$ = this._stopService.getPrediction(data)
              .filter(stop => stop.dirNoPrediction === null)
              .share();
        }, error => console.log(error), () => callback());
  }

  // Save stop prediction
  private _savePrediction(predictionStream: Observable<any>) {
    this.routes = [];
    predictionStream
        .groupBy(stop => stop.routeTitle)
        .subscribe(group => group.toArray().subscribe(stops => {
          this.routes.push({ title: stops[0].routeTitle, stops: stops })
        }));
  }

  // Add stop tooltip and draw stops on map
  private _drawStopInfo(predictionStream: Observable<any>) {
    predictionStream.toArray()
        .subscribe(stops => {
          const info = stops.map((stop: StopPrediction) => {
            let text = `${stop.stopTitle}<br>`;
            if (stop.dir && stop.dir.length > 0) {
              text += stop.dir.map(direction => {
                const prediction = direction.prediction[0] ? direction.prediction[0].min : '';
                return `${direction.title} - ${prediction}min<br>`;
              }).join();
            }
            return text;
          });
          this._mapService.drawStops(stops, info);
        });
  }

  // Calculate the closet stop
  private _getClosestLocation(prediction$: Observable<any>, onComplete = () => {
  }) {
    const loc = this.currentLocation;
    prediction$.toArray().subscribe(stops => {
      const result = stops.reduce((acc, stop) => {
        const dLat = Math.abs(+stop.lat) - Math.abs(loc.lat);
        const dLng = Math.abs(+stop.lng) - Math.abs(loc.lng);
        const distance = Math.sqrt(dLat * dLat + dLng * dLng);
        return acc.diff > distance ? { diff: distance, stop } : acc;
      }, { diff: 1, stop: {} });
      this.closestStop = result.stop;
    }, err => console.log(err), () => onComplete());
  }
}