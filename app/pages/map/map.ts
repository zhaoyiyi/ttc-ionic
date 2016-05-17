import { Page, NavController } from 'ionic-angular';
import { RouteService } from "./bus/route.service";
import { RouteComponent } from "./bus/route.component";
import { StopsComponent } from "./stops/stops.component";
import { MapComponent } from "./map/map.component";
import { MapService } from "./map/map.service";

@Page({
  templateUrl: 'build/pages/map/map.html',
  directives: [RouteComponent, StopsComponent, MapComponent],
  providers: [RouteService, MapService]
})
export class MapPage {
  routeInfoStream: any;
  locationStream: any;

  constructor(public nav: NavController,
              private routeService: RouteService) {
  }

  onRouteChange(routeNum) {
    this.routeInfoStream = this.routeService.getRoute(routeNum);
    this.locationStream = this.routeService.getBusLocations(routeNum);
    console.log('sending route info...');
  }

}
