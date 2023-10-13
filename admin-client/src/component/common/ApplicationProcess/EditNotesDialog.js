import React, { useState, useEffect } from "react";
import axiosInstance from "../../../api";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextareaAutosize,
} from "@mui/material";
import Notification from "../Notification/notification";

function EditNotesDialog({ open, onClose, applicantId, notes }) {
  const [newNotes, setNewNotes] = useState(notes);
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

  useEffect(() => {
    setNewNotes(notes); // Update newNotes when notes prop changes
  }, [notes]);

  const handleSave = async () => {
    try {
      console.log("save handler reached")
      console.log(applicantId);
      console.log(newNotes); // Use newNotes, not notes

      await axiosInstance.put(`https://bhr-server-9omo.onrender.com/api/users/editNotes/${applicantId}`, {
        newNotes,
      });
      showNotification("Status updated!", "success");
      onClose();
    } catch (error) {
      showNotification("Error updating status - check console", "error");
      console.error("Error updating status:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Notes</DialogTitle>
      <DialogContent>
        <TextareaAutosize
          style={{
            width: "90%",
            minHeight: "300px",
            border: "1px solid #ccc",
            padding: "10px",
          }}
          value={newNotes} // Bind value to newNotes
          onChange={(e) => setNewNotes(e.target.value)} // Update newNotes on change
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
        <Notification
            open={notificationOpen}
            message={notificationMessage}
            severity={notificationSeverity}
            onClose={handleNotificationClose}
          />
      </DialogActions>
    </Dialog>
  );
}

export default EditNotesDialog;
