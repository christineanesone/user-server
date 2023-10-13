import React, { createContext, useContext, useReducer } from "react";
import axiosInstance from "../api";

const AuthContext = createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "signIn":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case "signOut":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Handle user signIn
  const signIn = async (email, password, navigate) => {
    try {
      const { data } = await axiosInstance.post("/api/users/signIn", {
        email,
        password,
      });

      // Store the token in local storage
      localStorage.setItem("userToken", data.token);

      // Set the token as an authentication header for axiosInstance
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      // Redirect to the profile page
      navigate("/profile");

      dispatch({
        type: "signIn",
        payload: {
          user: data,
        },
      });
    } catch (err) {
      if (err.response && err.response.data) {
        console.error(err.response.data.error, "error");
      } else {
        console.error("An error occurred:", err);
      }
    }
  };

  // Handle user signOut
  const signOut = async () => {
    try {
      await axiosInstance.post("/api/users/signOut"); // Request signOut route from server side
      // Clear the token from local storage
      localStorage.removeItem("userToken");
      // Remove the token from axiosInstance headers
      delete axiosInstance.defaults.headers.common["Authorization"];

      dispatch({ type: "signOut" });
    } catch (err) {
      console.error("An error occurred during sign-out:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
//Custom hook to use the AuthContext
export function useAuth() {
  return useContext(AuthContext);
}
