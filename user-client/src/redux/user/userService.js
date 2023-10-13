import { setUser, setLoading, setError, updateUser } from "../user/userSlice";
import axiosInstance from "../../api";
const API_URL = "/api/users/";

export const fetchUser = () => async (dispatch) => {
  try {
    const response = await axiosInstance.get(API_URL + "info");

    //set response data to userData
    const userData = response.data;
    const userId = response.data.id;

    // Dispatch the setUser action with the fetched user data
    dispatch(setUser({ user: userData, id: userId }));
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

export const updateUserProfile = (updatedProfile) => async (dispatch) => {
  dispatch(setLoading(true)); // Set loading state to true
  try {
    // Send a PUT request to update the admin user's profile
    await axiosInstance.put(API_URL + `updateProfile`, updatedProfile);

    // Fetch the updated user data after the profile is updated
    const response = await axiosInstance.get(API_URL + "info");

    // Update user data in localStorage
    dispatch(updateUser(response.data));
    localStorage.setItem("user", JSON.stringify(response.data));
  } catch (error) {
    console.error("Error updating user profile:", error);
    dispatch(setError(error.message || "Failed to update profile - check console")); // Dispatch error message
  } finally {
    dispatch(setLoading(false)); // Set loading state to false regardless of success or failure
  }
};

export const uploadImage = (imageData) => async (dispatch) => {
  try {
    // Set loading to true while the image is being uploaded
    dispatch(setLoading(true));

    // Make a POST request to upload the image
    const response = await axiosInstance.post(API_URL + "image/upload", {
      image: imageData,
    });

    // Extract the image URL from the response data
    const imageUrl = response.data.imageUrl;

    // Dispatch the setUser action with the updated user data including the new image URL
    dispatch(setUser({ profileImage: imageUrl }));

    // Store the updated image URL in local storage
    localStorage.setItem("profileImage", imageUrl);

    dispatch(setLoading(false));

    console.log("Profile image upload is successful", response);
  } catch (error) {
    console.error("Error uploading image:", error);
    dispatch(setError("Failed to upload image"));
    dispatch(setLoading(false));
  }
};

const userService = {
  fetchUser,
  updateUserProfile,
  uploadImage
};

export default userService;
