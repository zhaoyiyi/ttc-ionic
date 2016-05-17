import { Observable } from 'rxjs/Rx';

// TODO: make only one location request
export function getCurrentLocation(): Observable<any> {
  if (navigator.geolocation) {
    return Observable.create((observer) => {
      navigator.geolocation.getCurrentPosition(position => {
        console.log('getting current location...');
        let pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        observer.next(pos);
        observer.complete();
      });
    });
  }
}
