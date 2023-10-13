import React, { useEffect, useState } from "react";
import axiosInstance from "../api";
import {
  Typography,
  Container,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import SearchIcon from "@mui/icons-material/Search";
import Navbar from "../component/common/Nav_bar/Navbar";
import Sidebar from "../component/common/Side_bar/SideBar";
import { Link as RouterLink } from "react-router-dom";
import LoadingSpinner from "../component/common/LoadingSpinner/LoadingSpinner";

const ViewAllEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [allApplicants, setAllApplicants] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeesAndApplicants = async () => {
      try {
        const [empResponse, appResponse] = await Promise.all([
          axiosInstance.get("/api/users/employees"),
          axiosInstance.get("/api/applicants/applicant"),
        ]);
        setIsLoading(false);
        setEmployees(empResponse.data);
        setAllApplicants(appResponse.data);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    fetchEmployeesAndApplicants();
  }, []);

  const getFirstAidExpiration = (employeeEmail) => {
    const applicant = allApplicants.find((app) => app.email === employeeEmail);
    return applicant ? applicant.firstAidExpiration : "N/A";
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.firstName.toLowerCase().includes(searchName.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <div className="page-container">
      <Sidebar />
      <Navbar />
      <Container style={{ marginRight: "40px" }}>
        <Typography variant="h4" gutterBottom>
          Current Employees
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
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <Card elevation={3}>
            <CardContent>
              <TableContainer component={Paper}>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>First Aid Expiry</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee._id}>
                        <TableCell>
                          <Link
                            component={RouterLink}
                            to={`/employeeDetails/employee/${employee._id}`}
                            color="primary"
                          >
                            {employee.firstName} {employee.lastName}
                          </Link>
                        </TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>{employee.role}</TableCell>
                        <TableCell>
                          {new Date(getFirstAidExpiration(employee.email)) <
                          new Date() ? (
                            <>
                              {getFirstAidExpiration(employee.email)}
                              <ErrorIcon color="error" />
                            </>
                          ) : (
                            getFirstAidExpiration(employee.email)
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default ViewAllEmployees;
