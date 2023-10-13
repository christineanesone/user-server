import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    error: null, 
    profileImage: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.id = action.payload.id;
      state.loading = false; 
      state.error = null; 
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      state.loading = false; 
      state.error = null; 
    },
  },
});

export const { setUser, setLoading, setError, updateUser} = userSlice.actions;

export default userSlice.reducer;
