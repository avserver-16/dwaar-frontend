import { useQuery, useMutation } from '@tanstack/react-query';
import { groupsApi } from '../api/groups';
import { useAuth } from '../context/AuthContext';

export const useUserGroups = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['userGroups', user?._id],
    queryFn: () => groupsApi.getUserGroups(user!._id),
    enabled: !!user?._id,
  });
};

export const useGroup = (groupId: string) => {
  return useQuery({
    queryKey: ['group', groupId],
    queryFn: () => groupsApi.getGroupById(groupId),
    enabled: !!groupId,
  });
};

export const useCreateGroup = () => {
  return useMutation({
    mutationFn: (data: any) => {
      return groupsApi.createGroup(data);
    },
  });
};

export const useAddGroupMember = () => {
  return useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) => {
      return groupsApi.addMember(groupId, userId);
    },
  });
};

export const useRemoveGroupMember = () => {
  return useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) => {
      return groupsApi.removeMember(groupId, userId);
    },
  });
};

export const useGroupMessages = (groupId: string) => {
  return useQuery({
    queryKey: ['groupMessages', groupId],
    queryFn: () => groupsApi.getGroupMessages(groupId),
    enabled: !!groupId,
  });
};

export const useJoinGroup = () => {
  return useMutation({
    mutationFn: (groupId: string) => {
      return groupsApi.joinGroup(groupId);
    },
  });
};