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
const signOut = async () => {
  try {
    // Make a request to the sign-out endpoint on the server
    await axiosInstance.post(`${API_URL}/signOut`);

    // Clear the user data from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userToken");
    // Return a success message or handle the sign-out success
    return { success: true, message: "Sign out successful" };
  } catch (error) {
    console.error("Sign out failed:", error);
    throw error;
  }
};

const authService = {
  signIn,
  signOut,
  signUp
};

export default authService;
