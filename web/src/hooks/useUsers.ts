import { useQuery, useMutation } from '@tanstack/react-query';
import { usersApi } from '../api/users';
import { useAuth } from '../context/AuthContext';
import type { Location } from '../types';

export const useCurrentUser = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => usersApi.getCurrentUser(),
    enabled: isAuthenticated,
  });
};

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => usersApi.getUserById(userId),
    enabled: !!userId,
  });
};

export const useUpdateUser = () => {
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => {
      return usersApi.updateUser(id, data);
    },
    onSuccess: (data) => {
      updateUser(data);
    },
  });
};

export const useUserLocation = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['userLocation'],
    queryFn: () => usersApi.getLocation(),
    enabled: isAuthenticated,
  });
};

export const useAddLocation = () => {
  return useMutation({
    mutationFn: (location: Location) => {
      return usersApi.addLocation(location);
    },
  });
};

export const useNearbyBuildings = (
  location: Location | null,
  radius?: number
) => {
  return useQuery({
    queryKey: ['nearbyBuildings', location, radius],
    queryFn: () => usersApi.getNearbyBuildings(location!, radius),
    enabled: !!location,
  });
};

export const useJoinRoom = () => {
  return useMutation({
    mutationFn: (roomId: string) => {
      return usersApi.joinRoom(roomId);
    },
  });
};

export const useJoinedRooms = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['joinedRooms'],
    queryFn: () => usersApi.getJoinedRooms(),
    enabled: isAuthenticated,
  });
};