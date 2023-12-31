import React, { useState } from "react";
import axiosInstance from "../../../api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import Notification from "../Notification/notification";

function UpdateEmploymentDialog({ open, onClose, applicantId }) {
  const attribute = "role";

  const [selectedStatus, setSelectedStatus] = useState(null);
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

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value); // Update selectedStatus state
    console.log(event.target.value);
  };

  const handleUpdateStatus = async () => {
    try {
      const updatedStatus = selectedStatus;
      console.log(applicantId);
      console.log(updatedStatus);
      await axiosInstance.put(`/api/applicants/applicant/updateStatus/${applicantId}`, {
        updatedStatus,
        attribute,
      });

      // Close the dialog
      onClose();
    } catch (error) {
      console.error("Error updating status:", error);
      // Handle error (e.g., show an error message to the user)
      showNotification("Status was not updated", "error");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Employment Status</DialogTitle>
      <DialogContent>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="status"
            name="status"
            value={selectedStatus}
            onChange={handleStatusChange}
          >
            <FormControlLabel
              value="Applicant"
              control={<Radio />}
              label="Applicant"
            />
            <FormControlLabel
              value="Employee"
              control={<Radio />}
              label="Employee"
            />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleUpdateStatus} color="primary">
          Update
        </Button>
      </DialogActions>

      <Notification
        open={notificationOpen}
        message={notificationMessage}
        severity={notificationSeverity}
        onClose={handleNotificationClose}
      />
    </Dialog>
  );
}

export default UpdateEmploymentDialog;
