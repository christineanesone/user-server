import React, { useState } from "react";
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

function RefereeDialog({ open, onClose, onSave }) {
  const [localSelectedReferees, setLocalSelectedReferees] = useState([]);

  const handleSave = () => {
    onSave(localSelectedReferees);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Referee List</DialogTitle>
      <DialogContent>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="status"
            name="status"
            value={localSelectedReferees}
            onChange={(event) => setLocalSelectedReferees(event.target.value)}
          >
            <FormControlLabel value="None" control={<Radio />} label="None" />
            <FormControlLabel
              value="One Referee"
              control={<Radio />}
              label="One Referee"
            />
            <FormControlLabel
              value="Two Referees"
              control={<Radio />}
              label="Two Referees"
            />
            <FormControlLabel
              value="Three Referees"
              control={<Radio />}
              label="Three Referees"
            />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default RefereeDialog;
