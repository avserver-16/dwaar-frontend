import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE =
  `${process.env.EXPO_PUBLIC_API_URL}/users`;

export const addUserLocation = async (
  locationData: {
    latitude: number;
    longitude: number;
    city?: string;
    region?: string;
    country?: string;
  }
) => {
  try {
    const token =
      await AsyncStorage.getItem("authToken");

    if (!token) return null;

    const response = await fetch(
      `${BASE}/add-location`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(locationData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.msg || "Failed to update location"
      );
    }

    return data;
  } catch (error) {
    console.log("Add location error:", error);
    return null;
  }
};