//Reducers and initial states
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

// Get user from localStorage
const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
};

// Sign in admin
export const signIn = createAsyncThunk(
  "auth/signIn",
  async (user, thunkAPI) => {
    try {
      const response = await authService.signIn(user);
      if (response.isAdmin) {
        return response; // If isAdmin is true, return the user data
      } else {
        return thunkAPI.rejectWithValue({
          message: "You are not authorized as an admin.",
        });
      }
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

//Sign out admin
export const signOut = createAsyncThunk("auth/signOut", async () => {
  await authService.signOut();
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    //clearing state after user has signed up
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        const user = action.payload;
        if (user && user.isAdmin) {
          state.user = user;
          state.isError = false;
          state.isSuccess = true;
          state.isLoading = false;
          state.message = "You are authorised as an admin.";
        } else {
          state.user = null;
          state.isError = true;
          state.isSuccess = false;
          state.message = "You are not authorised as an admin.";
        }
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
