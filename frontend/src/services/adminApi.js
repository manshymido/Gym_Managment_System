import api from './api.js';

// Auth
export const adminLogin = (email, password) => {
  return api.post('/admin/auth/login', { email, password });
};

export const adminRegister = (data) => {
  return api.post('/admin/auth/register', data);
};

export const getAdminProfile = () => {
  return api.get('/admin/auth/profile');
};

// Gym Managers
export const getAllGymManagers = (params) => {
  return api.get('/admin/gym-managers', { params });
};

export const getGymManagerById = (id) => {
  return api.get(`/admin/gym-managers/${id}`);
};

export const updateGymManager = (id, data) => {
  return api.put(`/admin/gym-managers/${id}`, data);
};

export const deleteGymManager = (id) => {
  return api.delete(`/admin/gym-managers/${id}`);
};

// Plans
export const getAllPlans = (params) => {
  return api.get('/admin/plans', { params });
};

export const getPlanById = (id) => {
  return api.get(`/admin/plans/${id}`);
};

export const createPlan = (data) => {
  return api.post('/admin/plans', data);
};

export const updatePlan = (id, data) => {
  return api.put(`/admin/plans/${id}`, data);
};

export const deletePlan = (id) => {
  return api.delete(`/admin/plans/${id}`);
};

// Subscriptions
export const getAllSubscriptions = (params) => {
  return api.get('/admin/subscriptions', { params });
};

export const getSubscriptionById = (id) => {
  return api.get(`/admin/subscriptions/${id}`);
};

export const createSubscription = (data) => {
  return api.post('/admin/subscriptions', data);
};

export const updateSubscription = (id, data) => {
  return api.put(`/admin/subscriptions/${id}`, data);
};

export const cancelSubscription = (id) => {
  return api.delete(`/admin/subscriptions/${id}`);
};

// Payments
export const getAllPayments = (params) => {
  return api.get('/admin/payments', { params });
};

export const getPaymentById = (id) => {
  return api.get(`/admin/payments/${id}`);
};

export const getRevenueStats = (params) => {
  return api.get('/admin/payments/stats', { params });
};

