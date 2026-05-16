import * as Location from "expo-location";

export interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
  region?: string;
  country?: string;
}

export const requestLocationPermission = async () => {
  try {
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    return status === "granted";
  } catch (error) {
    console.log("Permission error:", error);
    return false;
  }
};

export const getCurrentLocation =
  async (): Promise<UserLocation | null> => {
    try {
      const permissionGranted =
        await requestLocationPermission();

      if (!permissionGranted) {
        return null;
      }

      /*
        GET GPS COORDINATES
      */
      const location =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      const { latitude, longitude } =
        location.coords;

      /*
        REVERSE GEOCODE
      */
      const address =
        await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

      return {
        latitude,
        longitude,
        city: address?.[0]?.city || "",
        region: address?.[0]?.region || "",
        country: address?.[0]?.country || "",
      };
    } catch (error) {
      console.log("Location fetch error:", error);
      return null;
    }
  };