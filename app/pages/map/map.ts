import { Page, NavController } from 'ionic-angular';
import { RouteService } from "./bus/route.service";
import { RouteComponent } from "./bus/route.component";
import { StopsComponent } from "./stops/stops.component";
import { MapComponent } from "./map/map.component";


@Page({
  templateUrl: 'build/pages/map/map.html',
  directives: [RouteComponent, StopsComponent, MapComponent],
})
export class MapPage {

  constructor(public nav: NavController,
              private routeService: RouteService) {

    routeService.getRoute()
        .subscribe(
            data => {
              console.log('subscribe');
              console.log(data)
            },
            error => console.log(err),
            () => console.log('finished'));

  }
}
