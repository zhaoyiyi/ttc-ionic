import { Component, OnInit, OnChanges, Input } from 'angular2/core';
import { MapService } from './map.service';
import { Observable, Subscription } from 'rxjs';
import { RouteService } from "../bus/route.service";


declare var google;
@Component({
  selector: 'map',
  template: `
    <div id="map" style="width: 100%; height: 93%;"></div>
  `
})
export class MapComponent implements OnInit, OnChanges {
  @Input() routeInfoStream: Observable<any>;
  @Input() locationStream: Observable<any>;
  public busLocations: Subscription;
  public stops: any;

  constructor(private _mapService: MapService,
              private _routeService: RouteService) {
  }

  public ngOnInit() {
    this._mapService.loadMap('#map');
    console.log(this._routeService.currentRoute);
    this._routeService.getRoute()
        .subscribe((num: string) => {
          console.log(num);
        }, err => console.log(err), () => console.log('complete'));
  }

  public ngOnChanges() {
    console.log('on changes');
    if (this._mapService.isInitialized) this.updateRoute();
    if (this.locationStream) this.initBuses();
  }

  // Draw bus route on map
  public updateRoute() {
    this.routeInfoStream
        .distinctUntilChanged((a, b) => a.id === b.id)
        .subscribe(data => {
          console.log('drawing path');
          this._mapService.drawPath(data.coords);
          // don't draw stops for better performance
          // this._mapService.drawStops(data.stops);
        });
  }

  public initBuses() {
    // unsubscribe the old stream before subscribe the new one
    if (this.busLocations) this.busLocations.unsubscribe();

    this.busLocations = this.locationStream
        .subscribe(data => this._mapService.drawBuses(data),
            err => console.log(err),
            () => this.updateBusLocation()
        );
  }

  // try refresh bus locations every 10 seconds
  public updateBusLocation() {
    this.busLocations = this.locationStream
        .delay(10000)
        .repeat()
        .subscribe(
            data => this._mapService.updateMarker(data),
            err => console.log(err),
            () => console.log('update location finished.')
        );
  }
}// end
