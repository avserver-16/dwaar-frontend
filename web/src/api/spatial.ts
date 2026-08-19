import apiClient from './axios';
import type { NearbyResponse, Location } from '../types';

export const spatialApi = {
  getNearby: async (location: Location, radius?: number): Promise<NearbyResponse> => {
    const response = await apiClient.post<NearbyResponse>('/api/spatial/nearby', {
      lat: location.coordinates[1], // latitude
      lon: location.coordinates[0], // longitude
      radius: radius || 1000,
    });
    return response.data;
  },

  getNearbyRooms: async (location: Location, radius?: number): Promise<any[]> => {
    const response = await apiClient.post<any[]>('/api/spatial/nearby-rooms', {
      lat: location.coordinates[1], // latitude
      lon: location.coordinates[0], // longitude
      radius: radius || 1000,
    });
    return response.data;
  },
};