import axios from 'axios';


// Todo : Add the base url of the server that it work in the development as well as in the production
export const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true,
  
});