import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import theme from "./styles/theme";
import { ThemeProvider } from "@mui/material/styles";
import PrivateRoutes from "./component/utils/Private_Routes/PrivateRoutes";

const App = () => {
  return (
    <Router>
      <div className="App">
        <ThemeProvider theme={theme}>
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            
            {/* Private routes */}
            <Route element={<PrivateRoutes />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </div>
    </Router>
  );
};

export default App;
