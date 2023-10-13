import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import SignIn from "./pages/SignIn";
import HomePage from "./pages/Home";
import AddApplicant from "./pages/AddApplicant";
import ViewAllEmployees from "./pages/ViewAllEmployees";
import ViewAllApplicants from "./pages/ViewAllApplicants";
import ApplicantDetails from "./pages/ApplicantDetails";
import EmployeeDetails from "./pages/EmployeeDetails";
import UserProfile from "./pages/UserProfile"; 
import Help from "./pages/Help"; 
import { ThemeProvider } from "@mui/material/styles";
import PrivateRoutes from "./component/utils/Private_Routes/PrivateRoutes";
import theme from "./styles/theme";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <Routes>
            <Route element={<SignIn />} path="/" exact />
            <Route element={<SignIn />} path="/sign-in" exact/>

            {/* Private routes */}
            <Route element={<PrivateRoutes />}>
              <Route element={<HomePage />} path="/home" exact/>
              <Route element={<AddApplicant />} path="/add-applicant" exact />
              <Route element={<ViewAllEmployees />} path="/view-employees" exact />
              <Route element={<ViewAllApplicants />} path="/view-applicants" exact/>
              <Route element={<ApplicantDetails />} path="/applicantDetails/applicant/:applicantId" exact/>
              <Route element={<EmployeeDetails />} path="/employeeDetails/employee/:employeeId" exact/>
              <Route element={<UserProfile />} path="/user-profile" exact/>
              <Route element={<Help />} path="/help" exact/>
            </Route>
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
