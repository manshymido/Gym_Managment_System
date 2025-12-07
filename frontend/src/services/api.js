import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000, // 30 seconds - matches backend request timeout
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.url, error.response?.status, error.message);
    
    // Handle 413 Payload Too Large error
    if (error.response?.status === 413) {
      const backendMessage = error.response?.data?.message;
      const limit = error.response?.data?.limit || '10MB';
      
      // Enhance error message with Arabic translation and limit information
      const enhancedError = {
        ...error,
        response: {
          ...error.response,
          data: {
            ...error.response.data,
            message: backendMessage || 
              `حجم البيانات المرسلة كبير جداً. الحد الأقصى المسموح به هو ${limit}`,
            limit: limit
          }
        }
      };
      
      console.warn('⚠️ Payload Too Large:', {
        url: error.config?.url,
        method: error.config?.method,
        limit: limit
      });
      
      return Promise.reject(enhancedError);
    }
    
    // Handle 429 Too Many Requests (Rate Limiting)
    if (error.response?.status === 429) {
      const retryAfter = error.response?.headers['retry-after'] || error.response?.headers['Retry-After'];
      const backendMessage = error.response?.data?.message || 'Too many requests';
      
      const enhancedError = {
        ...error,
        response: {
          ...error.response,
          data: {
            ...error.response.data,
            message: backendMessage.includes('Too many') 
              ? 'تم إرسال طلبات كثيرة جداً. يرجى المحاولة مرة أخرى لاحقاً.'
              : backendMessage,
            retryAfter: retryAfter ? parseInt(retryAfter) : null
          }
        }
      };
      
      console.warn('⚠️ Rate Limit Exceeded:', {
        url: error.config?.url,
        method: error.config?.method,
        retryAfter: retryAfter
      });
      
      return Promise.reject(enhancedError);
    }
    
    // Handle 408 Request Timeout
    if (error.response?.status === 408 || error.code === 'ECONNABORTED') {
      const enhancedError = {
        ...error,
        response: {
          ...error.response,
          status: 408,
          data: {
            success: false,
            message: 'انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.'
          }
        }
      };
      
      console.warn('⚠️ Request Timeout:', {
        url: error.config?.url,
        method: error.config?.method,
        timeout: error.config?.timeout
      });
      
      return Promise.reject(enhancedError);
    }
    
    // Don't redirect on login/register pages
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      window.location.href = '/admin/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;

