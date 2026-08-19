export interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export const requestLocationPermission = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('User denied the request for geolocation'));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error('Location information is unavailable'));
            break;
          case error.TIMEOUT:
            reject(new Error('The request to get user location timed out'));
            break;
          default:
            reject(new Error('An unknown error occurred'));
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

export const formatLocationForAPI = (position: GeolocationPosition) => {
  return {
    latitude: position.latitude,
    longitude: position.longitude,
  };
};
