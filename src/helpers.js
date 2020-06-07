import axios from 'axios'

let instance = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 10000,
  headers: {Accept: 'application/json',  'Content-Type': 'application/json'}, 
  withCredentials: true
});

export default instance