import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/user/userSlice";
import NavBar from "../component/common/NavBar";
import Footer from "../component/common/Footer";
import Notification from "../component/common/Notification";
import LoadingSpinner from "../component/common/LoadingSpinner";
import axiosInstance from "../api";

import {
  Container,
  Paper,
  Avatar,
  Typography,
  Box,
  Divider,
  Badge,
  Tooltip,
  Button,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";

const AvatarWrapper = styled(Avatar)({
  width: 150,
  height: 150,
  marginBottom: 20,
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
});

const SectionWrapper = styled("div")({
  marginBottom: 16,
});

const SpacedTypography = styled(Typography)({
  marginBottom: 8,
});

const UploadButton = styled(Button)({
  margin: "16px",
});

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const profileImage =
    useSelector((state) => state.user.profileImage) ||
    localStorage.getItem("profileImage");
  const [loading, setLoading] = useState(false);

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationSeverity, setNotificationSeverity] = useState("info");

  const showNotification = (message, severity) => {
    setNotificationMessage(message);
    setNotificationSeverity(severity);
    setNotificationOpen(true);
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };

  const [employeeDetails, setEmployeeDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    cellphone: "",
    employeeBlurb: "",
    age: "",
    firstAidExpiration: "",
    policeExpiryDate: "",
    profileImage: "",
  });
  const [allApplicants, setAllApplicants] = useState([]);

  // Function to format a date to 'dd/mm/yyyy'
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  // one month expiry
  const isExpiringInOneMonth = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const timeDifference = expiry - today;
    const monthInMilliseconds = 30 * 24 * 60 * 60 * 1000; // Approximate month in milliseconds

    return timeDifference <= monthInMilliseconds;
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  function uploadSingleImage(base64, userId) {
    setLoading(true);
    axiosInstance
      .post("/api/users/image/upload", { _id: userId, image: base64 })
      .then((res) => {
        const { imageUrl } = res.data;

        setEmployeeDetails((prevState) => ({
          ...prevState,
          profileImage: imageUrl,
        }));
        // Store the image URL in local storage
        localStorage.setItem("profileImage", imageUrl);
        showNotification("Image uploaded Successfully", "success");
      })
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.response.data.error);
        showNotification(error.response.data.error, "error");
      });
  }

  const uploadImage = async (event) => {
    const files = event.target.files;

    if (files.length === 1) {
      const base64 = await convertBase64(files[0]);
      uploadSingleImage(base64, user._id);
      return;
    }
  };

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        // Make the API request. No need to set the Authorization header manually since the token will be sent automatically with cookies.
        const response = await axiosInstance.get("/api/users/info");

        // Dispatch the setUser action to update the Redux store
        dispatch(setUser(response.data));

        setEmployeeDetails({
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          email: response.data.user.email,
          cellphone: response.data.user.cellphone,
          employeeBlurb: response.data.user.employeeBlurb,
          age: response.data.user.age,
          firstAidExpiration: formatDate(response.data.user.firstAidExpiration),
          policeExpiryDate: formatDate(response.data.user.policeExpiryDate),
        });
      } catch (error) {
        if (error.response) {
          console.log("Server Response", error.response.data);
        }
        console.log(error);
      }
    };

    const fetchApplicants = async () => {
      try {
        const response = await axiosInstance.get("/api/applicants/applicant");
        setAllApplicants(response.data);

        const matchingApplicant = response.data.find(
          (app) => app.email === employeeDetails.email
        );
        if (matchingApplicant) {
          setEmployeeDetails((prevState) => ({
            ...prevState,
            employeeBlurb: matchingApplicant.employeeBlurb,
            age: matchingApplicant.age,
            cellphone: matchingApplicant.cellphone,
            firstAidExpiration: formatDate(
              matchingApplicant.firstAidExpiration
            ),
            policeExpiryDate: formatDate(matchingApplicant.policeExpiryDate),
          }));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchEmployeeDetails();
    fetchApplicants();
  }, [employeeDetails.email]);

  return (
    <div>
      <NavBar />
      <br />
      <Container maxWidth="md" style={{ marginTop: "100px" }}>
        <SpacedTypography variant="h4"> Profile Details </SpacedTypography>
        <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                component={SectionWrapper}
              >
                <AvatarWrapper
                  alt={employeeDetails.firstName}
                  src={profileImage || employeeDetails.profileImage}
                />
                <SpacedTypography variant="h6">
                  {employeeDetails.firstName} {employeeDetails.lastName}
                </SpacedTypography>
                <SpacedTypography variant="subtitle1" color="textSecondary">
                  {employeeDetails.email}
                </SpacedTypography>
                <SpacedTypography variant="subtitle1" color="textSecondary">
                  {employeeDetails.cellphone}
                </SpacedTypography>

                <label htmlFor="upload-button">
                  <input
                    onChange={uploadImage}
                    type="file"
                    id="upload-button"
                    style={{ display: "none" }}
                    accept="image/*"
                  />
                  {loading && <LoadingSpinner />}
                  <UploadButton
                    size="small"
                    variant="outlined"
                    component="span"
                  >
                    Edit Profile Image
                  </UploadButton>
                </label>
              </Box>
            </Grid>
            <Divider style={{ marginBottom: "20px" }} />
            <Grid item xs={12} md={6}>
              <SectionWrapper>
                <Box display="flex" style={{ marginTop: "40px" }}>
                  <SpacedTypography variant="body1" fontWeight="bold">
                    Age
                  </SpacedTypography>
                  <Box marginLeft={3}>
                    <SpacedTypography variant="body1" paragraph>
                      {employeeDetails.age}
                    </SpacedTypography>
                  </Box>
                </Box>
                <Box display="flex" style={{ marginTop: "16px" }}>
                  <SpacedTypography variant="body1" fontWeight="bold">
                    Status
                  </SpacedTypography>
                  <Box marginLeft={3}>
                    <SpacedTypography variant="body1" paragraph>
                      {"Employee"}
                    </SpacedTypography>
                  </Box>
                </Box>

                <Box display="flex" style={{ marginTop: "16px" }}>
                  <SpacedTypography variant="body1" fontWeight="bold">
                    First Aid Expiry
                  </SpacedTypography>
                  <Box marginLeft={3}>
                    {employeeDetails.firstAidExpiration &&
                    !isNaN(new Date(employeeDetails.firstAidExpiration)) ? (
                      isExpiringInOneMonth(
                        employeeDetails.firstAidExpiration
                      ) ? (
                        <Tooltip title="First Aid Expiring soon. Renew within 3 months of expiry">
                          <Badge color="error" variant="dot" size="large">
                            <SpacedTypography variant="body1" paragraph>
                              {employeeDetails.firstAidExpiration}
                            </SpacedTypography>
                          </Badge>
                        </Tooltip>
                      ) : (
                        <SpacedTypography variant="body1" paragraph>
                          {employeeDetails.firstAidExpiration}
                        </SpacedTypography>
                      )
                    ) : null}
                  </Box>
                </Box>

                <Box display="flex" style={{ marginTop: "16px" }}>
                  <SpacedTypography variant="subtitle1" fontWeight="bold">
                    Police Check Expiry
                  </SpacedTypography>
                  <Box marginLeft={3}>
                    {employeeDetails.policeExpiryDate &&
                    !isNaN(new Date(employeeDetails.policeExpiryDate)) ? (
                      isExpiringInOneMonth(employeeDetails.policeExpiryDate) ? (
                        <Tooltip title="Police Check Expiring soon">
                          <Badge color="error" variant="dot" size="large">
                            <SpacedTypography variant="body1" paragraph>
                              {employeeDetails.policeExpiryDate}
                            </SpacedTypography>
                          </Badge>
                        </Tooltip>
                      ) : (
                        <SpacedTypography variant="body1" paragraph>
                          {employeeDetails.policeExpiryDate}
                        </SpacedTypography>
                      )
                    ) : null}
                  </Box>
                </Box>

                <Box
                  style={{
                    marginTop: "16px",
                  }}
                >
                  <SpacedTypography display="flex" fontWeight="bold">
                    Blurb:
                  </SpacedTypography>
                  <Box>
                    <Typography
                      variant="body1"
                      style={{
                        fontStyle: "italic",
                        color: "#555",
                        marginBottom: "16px",
                      }}
                    >
                      "{employeeDetails.employeeBlurb || "No blurb provided"}"
                    </Typography>
                  </Box>
                </Box>
              </SectionWrapper>
            </Grid>
          </Grid>
          <Notification
            open={notificationOpen}
            message={notificationMessage}
            severity={notificationSeverity}
            onClose={handleNotificationClose}
          />
        </Paper>
        <br />
        <br />
        <br />
      </Container>
      <br />
      <br />
      <Footer />
    </div>
  );
};

export default Profile;
