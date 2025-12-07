import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllAttendance, checkIn, checkOut, getAllMembers } from '../services/gymApi';

/**
 * Custom hook لإدارة الحضور (checkIn, checkOut) باستخدام React Query
 */
export const useAttendance = () => {
  const queryClient = useQueryClient();

  // Query for attendance data
  const {
    data: attendanceData,
    isLoading: attendanceLoading,
    error: attendanceError,
    refetch: refetchAttendance
  } = useQuery({
    queryKey: ['attendance'],
    queryFn: async () => {
      const response = await getAllAttendance();
      return response.data.attendance || [];
    },
    staleTime: 30000, // 30 seconds
  });

  // Query for members data
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

  // Mutation for check-in
  const checkInMutation = useMutation({
    mutationFn: async (memberId) => {
      const response = await checkIn({ memberId });
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch attendance data
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (err) => {
      console.error('Check-in error:', err);
    }
  });

  // Mutation for check-out
  const checkOutMutation = useMutation({
    mutationFn: async (attendanceId) => {
      const response = await checkOut(attendanceId);
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch attendance data
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (err) => {
      console.error('Check-out error:', err);
    }
  });

  // Combine loading states
  const loading = attendanceLoading || membersLoading;

  // Combine errors
  const error = attendanceError || membersError;
  const errorMessage = error?.response?.data?.message || error?.message || null;

  // Handle check-in with error handling
  const handleCheckIn = async (memberId) => {
    try {
      return await checkInMutation.mutateAsync(memberId);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'فشل تسجيل الحضور';
      throw new Error(errorMessage);
    }
  };

  // Handle check-out with error handling
  const handleCheckOut = async (attendanceId) => {
    try {
      return await checkOutMutation.mutateAsync(attendanceId);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'فشل تسجيل الخروج';
      throw new Error(errorMessage);
    }
  };

  return {
    attendance: attendanceData || [],
    members: membersData || [],
    loading,
    error: errorMessage,
    fetchData: refetchAttendance,
    handleCheckIn,
    handleCheckOut,
    isCheckingIn: checkInMutation.isPending,
    isCheckingOut: checkOutMutation.isPending
  };
};

