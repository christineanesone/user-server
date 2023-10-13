//Making http request and sending it back and setting data in localstorage
import axios from "axios";
const API_URL = "/api/users/";

//Admin signIn
const signIn = async (userData) => {
  const response = await axios.post(API_URL + "signIn", userData);
  console.log(response.data);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

// Sign out
const signOut = () => {
  localStorage.removeItem("user");
};

const authService = {
  signIn,
  signOut,
};

export default authService;
