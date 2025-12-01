import api from './api.js';

// Auth
export const gymManagerLogin = (email, password) => {
  return api.post('/gym/auth/login', { email, password });
};

export const gymManagerRegister = (data) => {
  return api.post('/gym/auth/register', data);
};

export const getGymManagerProfile = () => {
  return api.get('/gym/auth/profile');
};

// Members
export const getAllMembers = (params) => {
  return api.get('/gym/members', { params });
};

export const getMemberById = (id) => {
  return api.get(`/gym/members/${id}`);
};

export const createMember = (data) => {
  return api.post('/gym/members', data);
};

export const updateMember = (id, data) => {
  return api.put(`/gym/members/${id}`, data);
};

export const deleteMember = (id) => {
  return api.delete(`/gym/members/${id}`);
};

// Subscriptions
export const getAllSubscriptions = (params) => {
  return api.get('/gym/subscriptions', { params });
};

export const getSubscriptionById = (id) => {
  return api.get(`/gym/subscriptions/${id}`);
};

export const createSubscription = (data) => {
  return api.post('/gym/subscriptions', data);
};

export const updateSubscription = (id, data) => {
  return api.put(`/gym/subscriptions/${id}`, data);
};

export const cancelSubscription = (id) => {
  return api.delete(`/gym/subscriptions/${id}`);
};

// Payments
export const getAllPayments = (params) => {
  return api.get('/gym/payments', { params });
};

export const getPaymentById = (id) => {
  return api.get(`/gym/payments/${id}`);
};

export const createPayment = (data) => {
  return api.post('/gym/payments', data);
};

export const updatePayment = (id, data) => {
  return api.put(`/gym/payments/${id}`, data);
};

// Attendance
export const getAllAttendance = (params) => {
  return api.get('/gym/attendance', { params });
};

export const checkIn = (data) => {
  return api.post('/gym/attendance/checkin', data);
};

export const checkOut = (id) => {
  return api.put(`/gym/attendance/${id}/checkout`);
};

export const getMemberAttendance = (memberId, params) => {
  return api.get(`/gym/attendance/member/${memberId}`, { params });
};

// Reports
export const generateRevenueReport = (params) => {
  return api.post('/gym/reports/revenue', {}, { params });
};

export const generateMembersReport = () => {
  return api.post('/gym/reports/members', {});
};

export const generateAttendanceReport = (params) => {
  return api.post('/gym/reports/attendance', {}, { params });
};

export const getAllReports = (params) => {
  return api.get('/gym/reports', { params });
};

export const getReportById = (id) => {
  return api.get(`/gym/reports/${id}`);
};

// Member Plans
export const getAllMemberPlans = (params) => {
  return api.get('/gym/member-plans', { params });
};

export const getMemberPlanById = (id) => {
  return api.get(`/gym/member-plans/${id}`);
};

export const createMemberPlan = (data) => {
  return api.post('/gym/member-plans', data);
};

export const updateMemberPlan = (id, data) => {
  return api.put(`/gym/member-plans/${id}`, data);
};

export const deleteMemberPlan = (id) => {
  return api.delete(`/gym/member-plans/${id}`);
};

