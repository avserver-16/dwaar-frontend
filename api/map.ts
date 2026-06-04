

import axios from "axios";

const BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}`;

export const fetchLocationGeoJSON = async (
  state: string = "india"
) => {
  const response = await axios.get(
    `${BASE_URL}/maps/getMap`,
    {
      params: {
        map: state.toLowerCase(),
      },
    }
  );

  return response.data;
};