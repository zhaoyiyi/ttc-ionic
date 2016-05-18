import { App, IonicApp, Platform, MenuController } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { MapPage } from './pages/map/map';
import { RouteService } from "./pages/map/bus/route.service";
import { RouteComponent } from "./pages/map/bus/route.component";
import { StopsComponent } from "./pages/map/stops/stops.component";
import { MapComponent } from "./pages/map/map/map.component";
import { MapService } from "./pages/map/map/map.service";


@App({
  templateUrl: 'build/app.html',
  directives: [RouteComponent, StopsComponent, MapComponent],
  providers: [RouteService, MapService],
  config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
class MyApp {
  rootPage: any = MapPage;
  routeInfoStream: any;
  locationStream: any;

  constructor(private app: IonicApp,
              private platform: Platform,
              private menu: MenuController,
              private routeService: RouteService) {
    this.initializeApp();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      console.log('device ready');
    });
  }

  onRouteChange(routeNum) {
    this.routeService.setRoute(routeNum);
    this.routeInfoStream = this.routeService.getRoute(routeNum);
    this.locationStream = this.routeService.getBusLocations(routeNum);
    console.log('sending route info...');
  }

}
