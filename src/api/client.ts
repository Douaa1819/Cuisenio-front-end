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
  }
);
export default client;
