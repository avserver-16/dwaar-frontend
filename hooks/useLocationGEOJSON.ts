// src/hooks/useLocationGeoJSON.ts

import { useQuery } from "@tanstack/react-query";
import { fetchLocationGeoJSON } from "../api/map";


export const useLocationGeoJSON = (
  state: string = "india"
) => {
  return useQuery({
    queryKey: ["geojson", state],
    queryFn: () => fetchLocationGeoJSON(state),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 1,
  });
};