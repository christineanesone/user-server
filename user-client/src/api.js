import axios from 'axios';

//BASE URL for API req
const instance = axios.create({
  baseURL: `https://bhr-server-9omo.onrender.com`
  //`http://localhost:8080`

});

// Retrieve the token from your localStorage or wherever it is stored
const token = localStorage.getItem('token');

if (token) {
  instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default instance;