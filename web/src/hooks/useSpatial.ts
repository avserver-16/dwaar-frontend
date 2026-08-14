import { useQuery } from '@tanstack/react-query';
import { spatialApi } from '../api/spatial';
import type { Location } from '../types';

export const useNearby = (location: Location | null, radius?: number) => {
  return useQuery({
    queryKey: ['nearby', location, radius],
    queryFn: () => spatialApi.getNearby(location!, radius),
    enabled: !!location,
  });
};

export const useNearbyRooms = (location: Location | null, radius?: number) => {
  return useQuery({
    queryKey: ['nearbyRooms', location, radius],
    queryFn: () => spatialApi.getNearbyRooms(location!, radius),
    enabled: !!location,
  });
};