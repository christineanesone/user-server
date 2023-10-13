import axiosInstance from "../../api";

const API_URL = "/api/users";

const signUp = async ({ firstName, lastName, email, password }) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/signUp`, {
      firstName,
      lastName,
      email,
      password,
    });
    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

const signIn = async (email, password) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/signIn`, {
      email,
      password,
    });
    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
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
  signUp
};

export default authService;
