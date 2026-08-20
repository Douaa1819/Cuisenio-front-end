export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    ENDPOINTS: {
      AUTH: {
        LOGIN: '/v1/auth/login',
        REGISTER: 'v1/auth/register',
      },
      PROFILE: '/v1/profile'
    }
  };