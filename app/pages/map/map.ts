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
 
  constructor(public nav: NavController,
              private routeService: RouteService) {
  }

 
}
