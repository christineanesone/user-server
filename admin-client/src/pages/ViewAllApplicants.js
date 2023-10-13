import React, { useEffect, useState } from "react";
import axiosInstance from "../api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Container,
  TextField,
  InputAdornment,
  Link,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Navbar from "../component/common/Nav_bar/Navbar";
import Sidebar from "../component/common/Side_bar/SideBar";
import { Link as RouterLink } from "react-router-dom";
import LoadingSpinner from "../component/common/LoadingSpinner/LoadingSpinner";

const ViewAllApplicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axiosInstance.get(`/api/applicants/applicant`);
        const sortedApplicants = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setApplicants(sortedApplicants);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  //search function for applicant
  useEffect(() => {
    // Filter applicants based on searchName
    const filtered = applicants.filter(
      (applicant) =>
        applicant.firstName &&
        applicant.lastName &&
        (applicant.firstName.toLowerCase().includes(searchName.toLowerCase()) ||
          applicant.lastName.toLowerCase().includes(searchName.toLowerCase()))
    );
    setFilteredApplicants(filtered);
  }, [searchName, applicants]);

  return (
    <div className="page-container">
      <Sidebar />
      <Navbar />
      <Container style={{ marginRight: "40px" }}>
        <Typography variant="h4" gutterBottom>
          Applicants
        </Typography>
        <Box mb={2}>
          <TextField
            label="Search by Name"
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </Box>
        <Card elevation={3}>
          <CardContent>
            {isLoading ? ( // Display loading spinner while data is being fetched
              <LoadingSpinner />
            ) : (
              <TableContainer component={Paper}>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Application Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {applicants
                      .filter(
                        (applicant) =>
                          applicant.firstName &&
                          applicant.lastName &&
                          (applicant.firstName
                            .toLowerCase()
                            .includes(searchName.toLowerCase()) ||
                            applicant.lastName
                              .toLowerCase()
                              .includes(searchName.toLowerCase()))
                      )
                      .map((applicant) => (
                        <TableRow key={applicant._id}>
                          <TableCell>
                            <Link
                              component={RouterLink}
                              to={`/applicantDetails/applicant/${applicant._id}`}
                              color="primary"
                            >
                              {applicant.firstName} {applicant.lastName}
                            </Link>
                          </TableCell>
                          <TableCell>{applicant.email}</TableCell>
                          <TableCell>{applicant.applicationStatus}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default ViewAllApplicants;
