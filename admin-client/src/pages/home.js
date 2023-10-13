import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Divider,
  Card,
  CardContent,
  CardActionArea,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser } from "../redux/user/userService";
import Navbar from "../component/common/Nav_bar/Navbar";
import Sidebar from "../component/common/Side_bar/SideBar";
import { Link } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import BadgeIcon from "@mui/icons-material/Badge";
import ErrorIcon from "@mui/icons-material/Error";
import Chart from "chart.js/auto";

const HomePage = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [employees, setEmployees] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [expiredFirstAidEmployees, setExpiredFirstAidEmployees] = useState([]);
  const [expiredPoliceCheckEmployees, setExpiredPoliceCheckEmployees] =
    useState([]);

  useEffect(() => {
    // Dispatch the action to fetch user data when the component mounts
    dispatch(fetchUser());
  }, [dispatch]);

  //Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("/api/users/employees");
        setEmployees(response.data);

        // Filter out employees whose firstAidExpiration date has passed
        const expiredEmployees = response.data.filter((employee) => {
          const expiryDate = new Date(employee.firstAidExpiration);
          const currentDate = new Date();
          return expiryDate < currentDate;
        });
        setExpiredFirstAidEmployees(expiredEmployees);

        // Filter out employees whose policeExpiryDate has passed
        const policeExpiredEmployees = response.data.filter((employee) => {
          const expiryDatePolice = new Date(employee.policeExpiryDate);
          const currentDatePolice = new Date();
          return expiryDatePolice < currentDatePolice;
        });
        setExpiredPoliceCheckEmployees(policeExpiredEmployees);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(`/api/applicants/applicant`);

        setApplicants(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchApplicants();
  }, []);

  const chartRef = useRef(null);
  let myChart;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  useEffect(() => {
    if (applicants.length === 0) return; // Do nothing if there's no data yet

    const inProgress = applicants.filter(
      (app) => app.applicationStatus === "In Progress"
    ).length;
    const completed = applicants.filter(
      (app) => app.applicationStatus === "Completed"
    ).length;

    const pieData = {
      labels: ["In Progress", "Completed"],
      datasets: [
        {
          label: "# of Applicants",
          data: [inProgress, completed],
          backgroundColor: ["rgb(54, 162, 235)", "rgb(255, 205, 86)"],
          hoverOffset: 4,
        },
      ],
    };

    const ctx = chartRef.current.getContext("2d");

    // If a chart exists, destroy it before creating a new one
    if (myChart) {
      myChart.destroy();
    }

    myChart = new Chart(ctx, {
      type: "pie",
      data: pieData,
      options: chartOptions,
    });

    // Cleanup function to destroy chart instance
    return () => {
      if (myChart) {
        myChart.destroy();
      }
    };
  }, [applicants]);

  return (
    <div className="page-container">
      <Sidebar />
      <Navbar />

      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid style={{ marginTop: "40px" }}>
            <Typography variant="h4">
              Welcome {currentUser.firstName} to Belle Babysitter's Dashboard
            </Typography>
          </Grid>
          <Grid item md={6}></Grid>
          {/* Left Section - Components */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                {/* Total Employees Card */}
                <Card style={{ marginBottom: "16px", marginTop: "10px" }}>
                  <Link
                    to="/view-employees"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <CardActionArea>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          <BadgeIcon style={{ marginRight: "10px" }} />
                          Total Employees
                        </Typography>

                        <Divider style={{ width: "100%", margin: "8px 0" }} />

                        <Typography variant="h5">{employees.length}</Typography>
                      </CardContent>
                    </CardActionArea>
                  </Link>
                </Card>
              </Grid>

              <Grid item xs={6}>
                {/* Total Applicants Card */}
                <Card style={{ marginBottom: "16px", marginTop: "10px" }}>
                  <Link
                    to="/view-applicants"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <CardActionArea>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          <PeopleIcon style={{ marginRight: "10px" }} />
                          Total Applicants
                        </Typography>

                        <Divider style={{ width: "100%", margin: "8px 0" }} />

                        <Typography variant="h5">
                          {applicants.length}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Link>
                </Card>
              </Grid>

              <Grid item xs={12}>
                {/* Expired First Aid Certifications Paper */}
                <Paper
                  elevation={3}
                  style={{
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid red",
                    marginBottom: "16px",
                    position: "relative",
                  }}
                >
                  <ErrorIcon
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      color: "red",
                    }}
                  />
                  <Typography variant="h5">
                    Expired First Aid Certifications
                  </Typography>

                  <Divider style={{ width: "100%", margin: "8px 0" }} />

                  {expiredFirstAidEmployees.map((emp) => (
                    <Typography variant="body1" key={emp._id}>
                      {emp.firstName} {emp.lastName}
                    </Typography>
                  ))}
                </Paper>
              </Grid>

              <Grid item xs={12}>
                {/* Expired Police Checks Paper */}
                <Paper
                  elevation={3}
                  style={{
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid red",
                    marginBottom: "16px",
                    position: "relative",
                  }}
                >
                  <ErrorIcon
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      color: "red",
                    }}
                  />
                  <Typography variant="h5">Expired Police Checks</Typography>

                  <Divider style={{ width: "100%", margin: "8px 0" }} />

                  {expiredPoliceCheckEmployees.map((emp) => (
                    <Typography variant="body1" key={emp._id}>
                      {emp.firstName} {emp.lastName}
                    </Typography>
                  ))}
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Right Section - Components */}
          <Grid item xs={12} md={4}>
            <Card style={{ marginTop: '10px' }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Applications In Progress vs Completed
                </Typography>

                <Divider style={{ width: '100%', margin: '8px 0' }} />

                <div style={{ height: '317px' }}>
                  <canvas ref={chartRef} />
                </div>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Container>
    </div>
  );
};

export default HomePage;
