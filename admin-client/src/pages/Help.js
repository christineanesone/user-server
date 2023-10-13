import React, { useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Link,
  Button,
} from "@mui/material";
import Navbar from "../component/common/Nav_bar/Navbar";
import Sidebar from "../component/common/Side_bar/SideBar";

const Help = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isApplicantDialogOpen, setIsApplicantDialogOpen] = useState(false);
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);

  //Add applicant handle
  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false);
  };

  //Applicants details handle
  const handleOpenApplicantDialog = () => {
    setIsApplicantDialogOpen(true);
  };

  const handleCloseApplicantDialog = () => {
    setIsApplicantDialogOpen(false);
  };

  //Employee details handle
  const handleOpenEmployeeDialog = () => {
    setIsEmployeeDialogOpen(true);
  };

  const handleCloseEmployeeDialog = () => {
    setIsEmployeeDialogOpen(false);
  };

  //Admin details handle
  const handleOpenAdminDialog = () => {
    setIsAdminDialogOpen(true);
  };

  const handleCloseAdminDialog = () => {
    setIsAdminDialogOpen(false);
  };

  return (
    <div className="page-container">
      <Sidebar />
      <Navbar />
      <Container style={{ marginRight: "40px" }}>
        <Typography variant="h4" gutterBottom>
          Frequently Asked Questions
        </Typography>
        <Card elevation={3}>
          <CardContent>
            <div style={{ marginBottom: "20px" }}>
              <Link onClick={handleOpenAddDialog} variant="h6">
                How to add an applicant?
              </Link>
              <Dialog
                open={isAddDialogOpen}
                onClose={handleCloseAddDialog}
                maxWidth="lg"
                fullWidth
              >
                <DialogTitle>How to add an applicant?</DialogTitle>
                <DialogContent>
                  <iframe
                    title="Add Applicant"
                    src="https://scribehow.com/embed/Adding_an_applicant_on_a_website__5NBz9eTOR9i4YZ3zDXdVhw?as=scrollable&skipIntro=true"
                    width="100%"
                    height="640"
                    allowFullScreen
                    frameBorder="0"
                  ></iframe>
                  <Button
                    onClick={handleCloseAddDialog}
                    variant="contained"
                    color="primary"
                  >
                    Close
                  </Button>
                </DialogContent>
              </Dialog>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <Link onClick={handleOpenApplicantDialog} variant="h6">
                What can I do on the applicant details page?
              </Link>
              <Dialog
                open={isApplicantDialogOpen}
                onClose={handleCloseApplicantDialog}
                maxWidth="lg"
                fullWidth
              >
                <DialogTitle>
                  What can I do on the applicant details page?
                </DialogTitle>
                <DialogContent>
                  <iframe
                    title="Editing/Updating job application details"
                    src="https://scribehow.com/embed/Step-by-step_Guide_Editing_and_Updating_Job_Application_Details__RCMqIP-SRn2TRNUN_lbBpA?as=scrollable&skipIntro=true"
                    width="100%"
                    height="640"
                    allowfullscreen
                    frameborder="0"
                  ></iframe>
                  <Button
                    onClick={handleCloseApplicantDialog}
                    variant="contained"
                    color="primary"
                  >
                    Close
                  </Button>
                </DialogContent>
              </Dialog>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <Link onClick={handleOpenEmployeeDialog} variant="h6">
                What can I do on the employee details page?
              </Link>
              <Dialog
                open={isEmployeeDialogOpen}
                onClose={handleCloseEmployeeDialog}
                maxWidth="lg"
                fullWidth
              >
                <DialogTitle>
                  What can I do on the employee details page?
                </DialogTitle>
                <DialogContent>
                  <iframe
                    title="Employee details"
                    src="https://scribehow.com/embed/Employee_Details__wbPGifT3TE6Lop1s52iJ-g?as=scrollable&skipIntro=true"
                    width="100%"
                    height="640"
                    allowFullScreen
                    frameBorder="0"
                  ></iframe>
                  <Button
                    onClick={handleCloseEmployeeDialog}
                    variant="contained"
                    color="primary"
                  >
                    Close
                  </Button>
                </DialogContent>
              </Dialog>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <Link onClick={handleOpenAdminDialog} variant="h6">
                How do I edit the admin details?
              </Link>
              <Dialog
                open={isAdminDialogOpen}
                onClose={handleCloseAdminDialog}
                maxWidth="lg"
                fullWidth
              >
                <DialogTitle>How do I edit the admin details?</DialogTitle>
                <DialogContent>
                  <iframe
                    title="Admin details"
                    src="https://scribehow.com/embed/Edit_Profile_Information__2_kRaev4Qd2UMeuCmZw48Q?as=scrollable&skipIntro=true"
                    width="100%"
                    height="640"
                    allowfullscreen
                    frameborder="0"
                  ></iframe>
                  <Button
                    onClick={handleCloseAdminDialog}
                    variant="contained"
                    color="primary"
                  >
                    Close
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default Help;
