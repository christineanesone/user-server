import React, { useState } from "react";
import axiosInstance from "../../../api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import Notification from "../Notification/notification";

function UploadFileDialog({
  open,
  onClose,
  applicantId,
  attribute,
}) {
  const [file, setFile] = useState(null);
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

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };


  const handleFileUpload = () => {

    if (attribute === "additionalInformationStatus") {
      attribute = "additionalInformation"
    } else if (attribute === "faceToFaceInterviewStatus") {
      attribute = "faceInterviewNotes"
    } else if (attribute === "phoneInterviewStatus") {
      attribute = "phoneInterviewNotes"
    }
    
    console.log(attribute)
    console.log(attribute)

    if (!file) {
      // Ensure a file is selected before attempting to upload
      console.error("No file selected for upload");
      showNotification("No file selected for upload", "error");
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);

    console.log(applicantId);
    console.log(formData);
    console.log(attribute);
    axiosInstance.post(`/api/users/uploadFile/${applicantId}?attribute=${attribute}`, formData, {
    })
      .then((response) => {
        console.log(response);
        // Handle success, possibly update UI
        console.log("File uploaded successfully FRONTEND");
        onClose(); // Close the dialog
      })
      .catch((error) => {
        // Handle errors, possibly show an error message to the user
        console.error("Error uploading file", error);
        showNotification("Error uploading file", "error");
      });

    };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Upload File</DialogTitle>
      <DialogContent>
        <TextField
          type="file"
          onChange={handleFileChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleFileUpload} color="primary">
          Upload
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

export default UploadFileDialog;
