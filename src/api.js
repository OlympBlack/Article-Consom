import axios from 'axios';

const api = axios.create({
  baseURL: 'https://article-api.lavoixdabouloussi.org/api', 
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
