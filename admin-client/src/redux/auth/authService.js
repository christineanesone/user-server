//Making http request and sending it back and setting data in localstorage
import axiosInstance from "../../api";
const API_URL = "/api/users/";

//Admin signIn
const signIn = async (email, password) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/signIn`, {
      email,
      password,
    });
    if (response.data.isAdmin === true) {
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } else {
      throw new Error("You are not authorized as an admin.");
    }
  } catch (error) {
    throw error;
  }
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
