import api from './api.js';

// Public Plans APIs (no authentication required)
export const getPublicPlans = () => {
  return api.get('/public/plans');
};

export const getPublicPlanById = (id) => {
  return api.get(`/public/plans/${id}`);
};

// Public Subscribe API (no authentication required)
export const publicSubscribe = (data) => {
  return api.post('/public/subscribe', data);
};
