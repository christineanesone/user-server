import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Notification from "../component/common/Notification/notification";
import { useDispatch } from "react-redux";
import { signIn } from "../redux/auth/authSlice";
import Footer from "../component/common/Footer/Footer";
import LoadingSpinner from "../component/common/LoadingSpinner/LoadingSpinner";

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
`;

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;
`;

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationSeverity, setNotificationSeverity] = useState("info");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const showNotification = (message, severity) => {
    setNotificationMessage(message);
    setNotificationSeverity(severity);
    setNotificationOpen(true);
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      showNotification("Please fill out all fields", "error");
      return;
    }

    if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      showNotification("Enter a valid email address", "error");
      return;
    }

    // Dispatch the signIn action from Auth state
    dispatch(signIn({ email, password }))
      .unwrap()
      .then(() => {
        setIsLoading(false);
        showNotification("Sign in successful", "success");
        navigate("/home");
      })
      .catch((error) => {
        // Handle error if needed
        setIsLoading(false);
        console.error("Sign-in failed:", error);
        showNotification("Sign in failed - check console", "error");
        // Extract error message from the payload and show notification
        if (error.payload && error.payload.message) {
          showNotification(error.payload.message, "error");
        } else {
          showNotification("Sign-in failed. Please try again.", "error");
        }
      });
  };

  return (
    <div>
      <PageWrapper>
        <FormWrapper onSubmit={handleSubmit}>
          <img src="/images/logoText.png" alt="logo" />
          <Typography variant="h6">Admin Sign In</Typography>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={handleEmailChange}
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"} // Toggle password visibility
            value={password}
            onChange={handlePasswordChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handlePasswordVisibility}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {!isLoading && (
            <Button type="submit" variant="contained" color="primary">
              Sign In
            </Button>
          )}
          {isLoading && <LoadingSpinner />}
        </FormWrapper>
        <Notification
          open={notificationOpen}
          message={notificationMessage}
          severity={notificationSeverity}
          onClose={handleNotificationClose}
        />
      </PageWrapper>
      <Footer />
    </div>
  );
};

export default SignIn;
