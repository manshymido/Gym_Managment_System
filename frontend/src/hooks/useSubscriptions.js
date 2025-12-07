import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllSubscriptions, createSubscription, updateSubscription, cancelSubscription } from '../services/gymApi';
import { getAllMembers, getAllMemberPlans } from '../services/gymApi';

/**
 * Custom hook لإدارة الاشتراكات باستخدام React Query
 */
export const useSubscriptions = () => {
  const queryClient = useQueryClient();

  // Query for subscriptions data
  const {
    data: subscriptionsData,
    isLoading: subscriptionsLoading,
    error: subscriptionsError,
    refetch: refetchSubscriptions
  } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const response = await getAllSubscriptions();
      return response.data.subscriptions || [];
    },
    staleTime: 30000, // 30 seconds
  });

  // Query for members data (reuse from members query if available)
  const {
    data: membersData,
    isLoading: membersLoading,
    error: membersError
  } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const response = await getAllMembers();
      return response.data.members || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query for plans data
  const {
    data: plansData,
    isLoading: plansLoading,
    error: plansError
  } = useQuery({
    queryKey: ['memberPlans', { isActive: 'true' }],
    queryFn: async () => {
      const response = await getAllMemberPlans({ isActive: 'true' });
      return response.data.plans || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation for creating a subscription
  const createSubscriptionMutation = useMutation({
    mutationFn: async (subscriptionData) => {
      const response = await createSubscription(subscriptionData);
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch subscriptions data
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
    onError: (err) => {
      console.error('Create subscription error:', err);
    }
  });

  // Mutation for updating a subscription
  const updateSubscriptionMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await updateSubscription(id, data);
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch subscriptions data
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
    onError: (err) => {
      console.error('Update subscription error:', err);
    }
  });

  // Mutation for canceling a subscription
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async (id) => {
      const response = await cancelSubscription(id);
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch subscriptions data
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
    onError: (err) => {
      console.error('Cancel subscription error:', err);
    }
  });

  // Combine loading states
  const loading = subscriptionsLoading || membersLoading || plansLoading;

  // Combine errors
  const error = subscriptionsError || membersError || plansError;
  const errorMessage = error?.response?.data?.message || error?.message || null;

  // Wrapper functions with error handling
  const addSubscription = async (subscriptionData) => {
    try {
      return await createSubscriptionMutation.mutateAsync(subscriptionData);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'فشل إضافة الاشتراك';
      throw new Error(errorMessage);
    }
  };

  const editSubscription = async (id, subscriptionData) => {
    try {
      return await updateSubscriptionMutation.mutateAsync({ id, data: subscriptionData });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'فشل تحديث الاشتراك';
      throw new Error(errorMessage);
    }
  };

  const removeSubscription = async (id) => {
    try {
      return await cancelSubscriptionMutation.mutateAsync(id);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'فشل إلغاء الاشتراك';
      throw new Error(errorMessage);
    }
  };

  return {
    subscriptions: subscriptionsData || [],
    members: membersData || [],
    plans: plansData || [],
    loading,
    error: errorMessage,
    fetchData: refetchSubscriptions,
    addSubscription,
    editSubscription,
    removeSubscription,
    isAdding: createSubscriptionMutation.isPending,
    isUpdating: updateSubscriptionMutation.isPending,
    isRemoving: cancelSubscriptionMutation.isPending
  };
};

