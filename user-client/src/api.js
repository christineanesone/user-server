import axios from 'axios';

//BASE URL for API req
const instance = axios.create({
  baseURL: `https://user-server-np4c.onrender.com`
  //`http://localhost:8080`
  //'https://user-server-np4c.onrender.com'
});

// Retrieve the token from your localStorage or wherever it is stored
const token = localStorage.getItem('token');

if (token) {
  instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default instance;