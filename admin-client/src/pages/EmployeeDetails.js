import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
  TextField,
  Tooltip,
  Grid,
} from "@mui/material";
import Navbar from "../component/common/Nav_bar/Navbar";
import Sidebar from "../component/common/Side_bar/SideBar";
import ErrorIcon from "@mui/icons-material/Error";

const EmployeeDetails = () => {
  const { employeeId } = useParams();
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [allApplicants, setAllApplicants] = useState([]);
  const [isEditingPoliceExpiryDate, setIsEditingPoliceExpiryDate] = useState(false);
  const [isEditingEmployeeBlurb, setIsEditingEmployeeBlurb] = useState(false);
  const [formattedPoliceExpiryDate, setFormattedPoliceExpiryDate] = useState("");



  // Function to format a date to 'dd/mm/yyyy'
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"; // handle null or undefined

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "Invalid Date";

    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };



  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get(
          `/api/users/employeesDetails/employee/${employeeId}`
        );
        setEmployeeDetails(response.data);
        // Set the formatted date here
        setFormattedPoliceExpiryDate(formatDate(response.data.policeExpiryDate));
      } catch (error) {
        console.log(error);
      }
    };

    fetchEmployeeDetails();
  }, [employeeId]);


  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get("/api/applicants/applicant");
        setAllApplicants(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchApplicants();
  }, []);

  const getFirstAidExpiration = (employeeEmail) => {
    const applicant = allApplicants.find((app) => app.email === employeeEmail);
    return applicant ? (applicant.firstAidExpiration) : "N/A";
  };

  //First Aid Expired Email 
  const handleSendFirstAidEmail = (email) => {
    const subject = "First Aid Certification Reminder";
    const body = `Dear ${employeeDetails.firstName},

Your First Aid certification has expired. Please consider renewing your certificate within the upcoming three months to avoid having to retake the entire course. Should you neglect to renew this certificate, your position as a Primary Babysitter will be temporarily relegated to that of a backup babysitter.


Regards,
Belle Babysitting`;

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  // Police Check Expired Email
  const handleSendPoliceEmail = (email) => {
    const subject = "Police Check Reminder";
    const body = `Dear ${employeeDetails.firstName},

Your police check has expired. Belle Babysitting will soon implement a renewal of your police check. We are operating under the assumption that we have permission to your personal details, in order to complete this check. Please inform us ASAP if this is not the case.

Regards,
Belle Babysitting`;

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const handleRoleChange = (userId, newRole) => {
    axios
      .put(
        `/api/users/setUser${newRole === "active" ? "Active" : "Inactive"
        }/${userId}`
      )
      .then((response) => {
        setEmployeeDetails((prevDetails) => ({
          ...prevDetails,
          role: newRole,
        }));
      })
      .catch((error) => {
        console.error("Error updating user role:", error);
        alert("Failed to update user status. Please try again.");
      });
  };

  // Status Change
  const handleStatusChange = () => {
    const newRole = employeeDetails.role === "active" ? "inactive" : "active";
    handleRoleChange(employeeId, newRole);
  };

  // update Police Expiry Date
  const updatePoliceExpiryDate = () => {
    axios.put(`/api/users/employeesDetails/employee/${employeeId}/policeExpiryDate`,
      {
        policeExpiryDate: employeeDetails.policeExpiryDate,
      }
    )
      .then((response) => {
        console.log("Successfully updated police expiry date");
        setIsEditingPoliceExpiryDate(false); // Set the editing to false once updated

        // Update the formattedPoliceExpiryDate here:
        setFormattedPoliceExpiryDate(formatDate(employeeDetails.policeExpiryDate));
      })
      .catch((error) => {
        console.error("Error updating police expiry date:", error);
      });
  };


  // six month expiry for police check 
  const isWithinSixMonths = (expiryDate) => {
    const today = new Date();
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(today.getMonth() + 6);
    return new Date(expiryDate) <= sixMonthsFromNow && new Date(expiryDate) > today;
  };


  //Updating employee blurb:
  const updateEmployeeBlurb = () => {
    axios.put(`/api/users/employeesDetails/employee/${employeeId}/employeeBlurb`,
      {
        employeeBlurb: employeeDetails.employeeBlurb,
      }
    )
      .then((response) => {
        console.log("Successfully updated employee blurb");
        setIsEditingEmployeeBlurb(false); // Set the editing to false once updated
      })
      .catch((error) => {
        console.error("Error updating employee blurb:", error);
      });
  };

  return (
    <div className="page-container">
      <Sidebar />
      <Navbar />

      <Container style={{ marginRight: "40px" }} maxWidth="lg">
        <Typography variant="h4">Employee Details</Typography>
        <Paper elevation={3}>
          <TableContainer component={Paper} style={{ marginTop: "20px" }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Name:</TableCell>
                  <TableCell>
                    {employeeDetails.firstName} {employeeDetails.lastName}
                  </TableCell>
                  <TableCell></TableCell>{" "}
                  {/* Additional TableCell for alignment */}
                </TableRow>
                <TableRow>
                  <TableCell>Email: </TableCell>
                  <TableCell>{employeeDetails.email}</TableCell>
                  <TableCell></TableCell>{" "}
                  {/* Additional TableCell for alignment */}
                </TableRow>
                <TableRow>
                  <TableCell> First Aid Expiry: </TableCell>
                  <TableCell>
                    {formatDate(getFirstAidExpiration(employeeDetails.email))}
                    {new Date(getFirstAidExpiration(employeeDetails.email)) <
                      new Date() && (
                        <Tooltip title="First Aid Certificate Expired">
                          <ErrorIcon color="error" />
                        </Tooltip>
                      )}
                  </TableCell>
                  <TableCell>
                    {new Date(getFirstAidExpiration(employeeDetails.email)) <
                      new Date() ? (
                      <Tooltip title="Email user">
                        <Button
                          size="small"
                          color="error"
                          style={{ fontSize: "8x", padding: "4px 6px" }}
                          onClick={() => handleSendFirstAidEmail(employeeDetails.email)}
                        >
                          <Grid item>
                            SEND EMAIL
                          </Grid>
                        </Button>
                      </Tooltip>
                    ) : null}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell> Police Check Expiry: </TableCell>
                  <TableCell>
                    {isEditingPoliceExpiryDate ? (
                      <TextField
                        type="date"
                        size="small"
                        value={employeeDetails.policeExpiryDate || ""}
                        onChange={(e) => {
                          const updatedDate = e.target.value;
                          setEmployeeDetails((prevDetails) => ({
                            ...prevDetails,
                            policeExpiryDate: updatedDate,
                          }));
                        }}
                      />
                    ) : (
                      <>
                        {formattedPoliceExpiryDate}
                        {new Date(employeeDetails.policeExpiryDate) < new Date() && (
                          <Tooltip title="Police Check Expired">
                            <ErrorIcon color="error" />
                          </Tooltip>
                        )}
                        {isWithinSixMonths(employeeDetails.policeExpiryDate) && (
                          <Tooltip title="Police Check Expiring Soon">
                            <ErrorIcon style={{ color: 'orange' }} />
                          </Tooltip>
                        )}
                        <Button
                          size="small"
                          style={{ marginLeft: "10px" }}
                          variant="text"
                          disableElevation
                          color="primary"
                          onClick={() => setIsEditingPoliceExpiryDate(true)}
                        >
                          Edit
                        </Button>
                      </>

                    )}
                  </TableCell>
                  <TableCell>
                    {isEditingPoliceExpiryDate ? (
                      <Button
                        size="small"
                        variant="contained"
                        disableElevation
                        color="primary"
                        onClick={updatePoliceExpiryDate}
                      >
                        Update Expiry Date
                      </Button>
                    ) : new Date(employeeDetails.policeExpiryDate) < new Date() ? (
                      <Tooltip title="Email user">
                        <Button
                          size="small"
                          color="error"
                          style={{ fontSize: "8x", padding: "4px 6px" }}
                          onClick={() => handleSendPoliceEmail(employeeDetails.email)}
                        >
                          <Grid item>
                            SEND EMAIL
                          </Grid>
                        </Button>
                      </Tooltip>
                    ) : null}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Employee Blurb:</TableCell>
                  <TableCell>
                    {isEditingEmployeeBlurb ? (
                      <TextField
                        size="small"
                        value={employeeDetails.employeeBlurb || ""}
                        onChange={(e) => {
                          const updatedBlurb = e.target.value;
                          setEmployeeDetails((prevDetails) => ({
                            ...prevDetails,
                            employeeBlurb: updatedBlurb,
                          }));
                        }}
                      />
                    ) : (
                      <>
                        {employeeDetails.employeeBlurb}
                        <Button
                          size="small"
                          style={{ marginLeft: "10px" }}
                          variant="text"
                          disableElevation
                          color="primary"
                          onClick={() => setIsEditingEmployeeBlurb(true)}
                        >
                          Edit
                        </Button>
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditingEmployeeBlurb && (
                      <Button
                        size="small"
                        variant="contained"
                        disableElevation
                        color="primary"
                        onClick={updateEmployeeBlurb}
                      >
                        Update Blurb
                      </Button>
                    )}
                  </TableCell>
                </TableRow>

                {/* Need to add more */}
                <TableRow>
                  {/* <TableCell>
                    ----- INSERT MORE DETAILS IF NEEDED ---------
                  </TableCell> */}
                  {/* <TableCell>
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      onClick={handleStatusChange}
                    >
                      Set{" "}
                      {employeeDetails.role === "active"
                        ? "Inactive"
                        : "Active"}
                    </Button>{" "}
                  </TableCell> */}
                  <TableCell></TableCell>{" "}
                  {/* Additional TableCell for alignment */}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </div>
  );
};

export default EmployeeDetails;
