import React, { useState } from "react";
import axiosInstance from "../api";
import {
  TextField,
  Button,
  Typography,
  Container,
  IconButton,
  InputAdornment,
  Grid,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import NavBar from "../component/common/NavBar";
import { useNavigate, Link } from "react-router-dom";
import Notification from "../component/common/Notification";
import Footer from "../component/common/Footer";
import styled from "styled-components";

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
`;

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { firstName, lastName, email, password, confirmPassword } = formData;
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationSeverity, setNotificationSeverity] = useState("info");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const showNotification = (message, severity) => {
    setNotificationMessage(message);
    setNotificationSeverity(severity);
    setNotificationOpen(true);
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };

  const handleChange = (firstName) => (e) => {
    setFormData((formData) => ({ ...formData, [firstName]: e.target.value }));
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!firstName || !lastName || !email || !password) {
      showNotification("Please fill out all fields", "error");
      return;
    }

    if (!firstName || firstName.length < 1) {
      showNotification(
        "First name should contain at least 1 character",
        "error"
      );
      return;
    }

    if (!lastName || lastName.length < 1) {
      showNotification(
        "Last name should contain at least 1 character",
        "error"
      );
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

    // Check if passwords match
    if (password !== confirmPassword) {
      showNotification("Passwords do not match", "error");
      return;
    }

    if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,30}$/.test(password)) {
      showNotification(
        "Password must have 6 to 30 characters, with at least 1 numeric digit, 1 uppercase letter, and 1 lowercase letter",
        "error"
      );
      return;
    }

    try {
      const { data } = await axiosInstance.post("/api/users/signUp", {
        firstName,
        lastName,
        email,
        password,
      });
      console.log(data);
      setFormData({ ...formData, confirmPassword: "" });
      if (data.success === true) {
        setFormData({ firstName: "", lastName: "", email: "", password: "" });
        showNotification(
          "You have signed up successfully, please login!",
          "success"
        );
        navigate("/sign-in");
      }
    } catch (err) {
      console.log(err.response.data.error);
      showNotification(err.response.data.error, "error");
    }
  };

  return (
    <div>
      <PageWrapper>
        <NavBar />

        <br />
        <div>
          <img src="/images/logoText.png" alt="logo" />
          <Typography variant="h7" paragraph align="center">
            Join our family of babysitters and provide exceptional care to
            families.
          </Typography>
        </div>

        <Container component="main">
          <Typography component="h1" variant="h4" sx={{ color: "black" }}>
            Sign Up Form
          </Typography>
          <br/>
          <form
            style={{ width: "100%", marginTop: "3px" }}
            onSubmit={handleSubmit}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="First Name"
                  autoFocus
                  value={formData.firstName}
                  onChange={handleChange("firstName")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="Last Name"
                  autoFocus
                  value={formData.lastName}
                  onChange={handleChange("lastName")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange("email")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
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
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="confirmPassword"
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleToggleConfirmPasswordVisibility}
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ margin: "24px 0 16px" }}
                >
                  Sign Up
                </Button>
              </Grid>
            </Grid>
            <Typography variant="body1" align="center">
                  Already have an account?{" "}
                  <Link to="/sign-in" style={{ color: "primary" }}>Sign in here</Link>
                </Typography>
          </form>
        </Container>

        {/* Snackbar to display success/error messages */}
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

export default SignUp;
