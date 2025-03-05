// src/api/client.ts
import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080', // Assurez-vous que c'est la bonne URL
});

export default client;