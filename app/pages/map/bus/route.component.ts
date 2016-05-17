import { Output, EventEmitter, Component } from "angular2/core";
import { Control } from 'angular2/common';
import 'rxjs/add/operator/combineLatest';
import { RouteService } from './route.service';


@Component({
  selector: 'route',
  template: `
    <ion-card>
      <ion-card-header>
          <span class="md-headline">Route List</span>
      </ion-card-header>
      <ion-card-content>
        <select [ngFormControl]="routeControl">
          <option *ngFor="#route of routes" [value]="route.tag">{{route.title}}</option>
        </select>
      </ion-card-content>
    </ion-card>
  `
})
export class RouteComponent {
  routes:any;
  routeControl:Control = new Control('');
  @Output() routeChange = new EventEmitter();

  constructor(private _routeService:RouteService) {
    // Emit route number when change item in dropdown list
    this.routeControl.valueChanges.subscribe(
        routeNum => this.routeChange.emit(routeNum),
        err => console.log('err in route component when emitting', err)
    );
    this.getRouteList();
  }

  getRouteList() {
    this._routeService.getRouteList().subscribe(
        data => this.routes = data,
        err => console.log(err),
        () => console.log('finish loading route list')
    );
  }

}
