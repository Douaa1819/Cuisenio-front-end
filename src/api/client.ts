import axios from 'axios';


const client = axios.create({
  baseURL: 'http://localhost:8080', 
  headers: { 'Content-Type': 'application/json' }
});

client.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token'); 
     if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
)

client.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors (e.g., redirect to login)
      console.error("Unauthorized access:", error)
     window.location.href = '/login';
    }
    return Promise.reject(error)
  },
)
export default client;
