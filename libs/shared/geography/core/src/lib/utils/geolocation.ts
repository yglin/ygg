import { GeoPoint } from '../location';

export async function getUserLocation(): Promise<GeoPoint> {
  if (navigator && navigator.geolocation) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => resolve(new GeoPoint(position.coords)),
        error => {
          console.warn(error.message);
          resolve(new GeoPoint());
        }
      );
    });
  } else {
    return new GeoPoint();
  }
}
