import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllMembers, createMember, updateMember, deleteMember } from '../services/gymApi';

/**
 * Custom hook لإدارة بيانات الأعضاء (CRUD operations) باستخدام React Query
 */
export const useMembers = (params = {}) => {
  const queryClient = useQueryClient();

  // Query for members data
  const {
    data: membersData,
    isLoading,
    error,
    refetch: fetchMembers
  } = useQuery({
    queryKey: ['members', params],
    queryFn: async () => {
      const response = await getAllMembers(params);
      return response.data.members || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation for creating a member
  const createMemberMutation = useMutation({
    mutationFn: async (memberData) => {
      const response = await createMember(memberData);
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch members data
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
    onError: (err) => {
      console.error('Create member error:', err);
    }
  });

  // Mutation for updating a member
  const updateMemberMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await updateMember(id, data);
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch members data
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
    onError: (err) => {
      console.error('Update member error:', err);
    }
  });

  // Mutation for deleting a member
  const deleteMemberMutation = useMutation({
    mutationFn: async (id) => {
      const response = await deleteMember(id);
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch members data
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
    onError: (err) => {
      console.error('Delete member error:', err);
    }
  });

  // Error message extraction
  const errorMessage = error?.response?.data?.message || error?.message || null;

  // Wrapper functions with error handling
  const addMember = async (memberData) => {
    try {
      return await createMemberMutation.mutateAsync(memberData);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'فشل إضافة العضو';
      throw new Error(errorMessage);
    }
  };

  const editMember = async (id, memberData) => {
    try {
      return await updateMemberMutation.mutateAsync({ id, data: memberData });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'فشل تحديث بيانات العضو';
      throw new Error(errorMessage);
    }
  };

  const removeMember = async (id) => {
    try {
      return await deleteMemberMutation.mutateAsync(id);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'فشل حذف العضو';
      throw new Error(errorMessage);
    }
  };

  return {
    members: membersData || [],
    loading: isLoading,
    error: errorMessage,
    fetchMembers,
    addMember,
    editMember,
    removeMember,
    isAdding: createMemberMutation.isPending,
    isUpdating: updateMemberMutation.isPending,
    isDeleting: deleteMemberMutation.isPending
  };
};

