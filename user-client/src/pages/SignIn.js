import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signIn } from "../redux/auth/authSlice";
import NavBar from "../component/common/NavBar";
import Notification from "../component/common/Notification";
import Footer from "../component/common/Footer";
import styled from "styled-components";
import LoadingSpinner from "../component/common/LoadingSpinner";

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
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationSeverity, setNotificationSeverity] = useState("info");
  const [anchorOrigin, setAnchorOrigin] = useState({
    vertical: "top",
    horizontal: "right",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  const handleChange = (name) => (e) => {
    setFormData((formData) => ({ ...formData, [name]: e.target.value }));
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const showNotification = (message, severity) => {
    setNotificationMessage(message);
    setNotificationSeverity(severity);
    setNotificationOpen(true);
    setAnchorOrigin(anchorOrigin);
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Client-side validation based on Mongoose schema rules
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

    try {
      setLoading(true);
      const response = await dispatch(signIn({ email, password }));
      const data = response.payload;

      if (data.success === true) {
        // Store the token
        localStorage.setItem("token", data.token);

        setFormData({ email: "", password: "" });
        // Handle successful login notification
        showNotification("Sign in successful", "success");

        // Redirect to profile
        navigate("/profile");
      } else {
        // Handle unsuccessful login notification
        showNotification(
          "Incorrect email or password. Please try again.",
          "error"
        );
      }
    } catch (error) {
      // Handle login error
      console.error("Sign in error:", error);
      // Handle unsuccessful login notification
      showNotification(
        "Sign in failed. Please check console for details.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageWrapper>
        <NavBar />
        <Container component="main">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Column for the image */}
            <div style={{ flex: 1, marginRight: "20px" }}>
              <img src="/images/logoText.png" alt="logo" />
              <Typography variant="h7" paragraph align="center">
                Join our family of babysitters and provide exceptional care to
                families.
              </Typography>
            </div>
            {/* Column for the sign-in form */}
            <div style={{ flex: 1 }}>
              <FormWrapper onSubmit={handleSubmit}>
                <Typography component="h1" variant="h4" sx={{ color: "black" }}>
                  Sign In Form
                </Typography>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange("email")}
                />
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="password"
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange("password")}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePasswordVisibility}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  style={{ margin: "24px 0 16px" }}
                  disabled={loading} // Disable the button while loading is true
                >
                  {loading ? <LoadingSpinner /> : "Sign In"}
                </Button>
                <Typography variant="body1" align="center">
                  Don't have an account?{" "}
                  <Link to="/sign-up" style={{ color: "primary" }}>
                    Sign up here
                  </Link>
                </Typography>
              </FormWrapper>
            </div>
          </div>
          {/* Snackbar to display success/error messages */}
          <Notification
            open={notificationOpen}
            message={notificationMessage}
            severity={notificationSeverity}
            onClose={handleNotificationClose}
            anchorOrigin={anchorOrigin}
          />
        </Container>
      </PageWrapper>
      <Footer />
    </div>
  );
};

export default SignIn;
