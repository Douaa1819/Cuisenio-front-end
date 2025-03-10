import axios from 'axios';
// import { authService } from './auth.service';


const client = axios.create({
  baseURL: 'http://localhost:8080', // Replace with your API base URL
  headers: { 'Content-Type': 'application/json' }
}); // Create the axios instance

// Add a request interceptor
client.interceptors.request.use(
  function (config) {
    // Do something before the request is sent
    // For example, add an authentication token to the headers
    const token = localStorage.getItem('token'); // taking auth token from local Storage
     if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    // Handle the error
    return Promise.reject(error);
  }
);
export default client;
