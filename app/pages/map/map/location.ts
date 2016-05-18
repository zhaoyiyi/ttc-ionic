import { Observable } from 'rxjs/Rx';
import { Geolocation } from 'ionic-native';

export function getCurrentLocation(): Observable<any> {

  return Observable.fromPromise(Geolocation.getCurrentPosition({
    timeout: 10000, enableHighAccuracy: true
  })).map(pos => {
    return {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    };
  })
}
