import {setUser, setLoading, setError } from "../user/userSlice";
import axios from "axios";
const API_URL = "/api/users/";

export const fetchUser = () => async (dispatch) => {
  try {
    const response = await axios.get(API_URL + "info");

    //set response data to userData
    const userData = response.data;

    // Dispatch the setUser action with the fetched user data
    dispatch(setUser(userData));
  } catch (error) {
    if (error.response) {
      console.error("Server Error:", error.response.data);
      throw new Error(error.response.data.message || "Server Error");
    } else if (error.request) {
      console.error("Network Error:", error.request);
      throw new Error("Network Error");
    } else {
      console.error("Request Error:", error.message);
      throw new Error("Request Error");
    }
  }
};

export const updateAdminProfile = (updatedProfile) => async (dispatch) => {
  dispatch(setLoading(true)); // Set loading state to true

  try {
    // Send a PUT request to update the admin user's profile
    await axios.put(API_URL + `admin/updateProfile`, updatedProfile);

    // Fetch the updated user data after the profile is updated
    const response = await axios.get(API_URL + "info");

    // Dispatch the setUser action with the updated user data
    // Update user data in localStorage
    dispatch(setUser(response.data));
    localStorage.setItem("user", JSON.stringify(response.data));
  } catch (error) {
    console.error("Error updating admin profile:", error);
    dispatch(setError(error.message || "Failed to update profile")); // Dispatch error message
  } finally {
    dispatch(setLoading(false)); // Set loading state to false regardless of success or failure
  }
};

const userService = {
  fetchUser,
  updateAdminProfile,
};

export default userService;
