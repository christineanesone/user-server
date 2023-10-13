import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./styles/global.css";
import { AuthProvider } from "./context/AuthContext";
import { Provider } from "react-redux";
import { store } from "./store/store";
// Set base URL for API endpoint
axios.defaults.baseURL = `https://bhr-server-9omo.onrender.com`;

// Retrieve the token from wherever you store it after user authentication
const token = localStorage.getItem("token");

// Set Authorization header globally for all Axios requests if the token exists
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
