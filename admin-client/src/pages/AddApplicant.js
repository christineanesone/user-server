import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Select,
  MenuItem,
  Container,
  Typography,
  Checkbox,
  Paper
} from "@mui/material";
import { useFilePicker } from "use-file-picker";
import Navbar from "../component/common/Nav_bar/Navbar";
import Sidebar from "../component/common/Side_bar/SideBar";
import Notification from "../component/common/Notification/notification";

function AddApplicant() {
  const [applicant, setApplicant] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    cellphone: "",
    landline: "",
    age: "",
    driversLicense: "",
    accessToCar: "",
    accessToCarOther: "",
    firstAid: "",
    firstAidExpiration: "",
    criminalConvictions: "",
    criminalConvictionsExplain: "",
    policeCheck: "",
    policeCheckOther: "",
    dunedinStay: "",
    dunedinStayOther: "",
    summerPeriod: "",
    summerPeriodOther: "",
    permanentResidence: "",
    dunedinArrivalDate: "",
    startWork: "",
    amountOfWork: [],
    amountOfWorkOther: "",
    regularShifts: [],
    regularShiftsOther: "",
    currentWorkStatus: "",
    referees: "",
    refereeInformation: "",
    refereesOther: "",
    coverLetter: null,
    curriculumVitae: null,
  });

  const [startDate, setStartDate] = useState(new Date());
  const [coverLetter, setCoverLetter] = useState(null);

  //Notification box
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

  const [curriculumVitae, setCurriculumVitae] = useState(null);

  //REFEREE TABLE
  const [localRefereeDetails, setLocalRefereeDetails] = useState([
    { name: "", email: "", phoneNumber: "", relationship: "", contacted: "" },
    { name: "", email: "", phoneNumber: "", relationship: "", contacted: "" },
    { name: "", email: "", phoneNumber: "", relationship: "", contacted: "" },
  ]);

  const handleRefereeChange = (rowIndex, field, value) => {
    const updatedDetails = [...localRefereeDetails];
    updatedDetails[rowIndex][field] = value;
    setLocalRefereeDetails(updatedDetails);

    const formattedRefereeInformation = updatedDetails
      .map((referee) => {
        return `${referee.name}, ${referee.email}, ${referee.phoneNumber}, ${referee.relationship}, ${referee.contacted}`;
      })
      .join("; ");

    setApplicant({
      ...applicant,
      refereeInformation: formattedRefereeInformation,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to create the applicant
      const { data } = await axios.post(
        "/api/applicants/add-applicant",
        applicant
      );
      console.log("ID in Handler:", data.applicant._id);

      if (data.success === true) {
        const applicantId = data.applicant._id;
        // Clear applicant data
        setApplicant({
          firstName: "",
          middleName: "",
          lastName: "",
          email: "",
          cellphone: "",
          landline: "",
          age: "",
          driversLicense: "",
          accessToCar: "",
          accessToCarOther: "",
          firstAid: "",
          firstAidExpiration: "",
          criminalConvictions: "",
          criminalConvictionsExplain: "",
          policeCheck: "",
          policeCheckOther: "",
          dunedinStay: "",
          dunedinStayOther: "",
          summerPeriod: "",
          summerPeriodOther: "",
          permanentResidence: "",
          dunedinArrivalDate: "",
          startWork: "",
          amountOfWork: "",
          amountOfWorkOther: "",
          regularShifts: "",
          regularShiftsOther: "",
          currentWorkStatus: "",
          referees: "",
          refereesOther: "",
          refereeInformation: "",
          coverLetter: "",
          curriculumVitae: "",
        });

        // Upload cover letter and CV files with the applicant ID and attribute
        const coverLetterFileName = await uploadFile(
          document.querySelector("#coverLetterInput").files[0],
          "pdf",
          applicantId,
          "coverLetter" 
        );
        const cvFileName = await uploadFile(
          document.querySelector("#cvInput").files[0],
          "pdf",
          applicantId,
          "curriculumVitae" 
        );

        // Handle success
        showNotification("Success! Applicant added", "success");
      } else {
        // Handle error
        showNotification("Failed to add the applicant.", "error");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const uploadFile = async (file, fieldName, applicantId, attribute) => {
    try {
      if (!file) return null;

      const formData = new FormData();
      formData.append(fieldName, file);

      console.log("ID in uploadFile Function:", applicantId);
      console.log("Attribute in upload function:", attribute);
      const uploadRequest = await axios.post(
        `/api/users/uploadFile/${applicantId}?attribute=${attribute}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (uploadRequest.statusText !== "OK") {
        // If the server responded with success as false or no success property at all
        const errorMessage =
          uploadRequest.data.message || "Failed to upload the file.";
        showNotification(errorMessage, "error");
      } else {
        return file.name;
      }
    } catch (err) {
      console.log(err);
      showNotification("Failed to upload the file.", "error");
    }
  };

  return (
    <div className="page-container">
      <Sidebar />
      <Navbar />

      <Container>
        <Typography variant="h4" gutterBottom>
          Add Applicant
        </Typography>
        <Paper elevation={3} style={{ padding: "10px" }}>
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "16px",
                marginTop: "16px",
              }}
            >
              <TextField
                label="First Name"
                value={applicant.firstName}
                onChange={(e) =>
                  setApplicant({ ...applicant, firstName: e.target.value })
                }
                required
                fullWidth
              />
              <TextField
                label="Middle Name"
                value={applicant.middleName}
                onChange={(e) =>
                  setApplicant({ ...applicant, middleName: e.target.value })
                }
                fullWidth
              />
              <TextField
                label="Last Name"
                value={applicant.lastName}
                onChange={(e) =>
                  setApplicant({ ...applicant, lastName: e.target.value })
                }
                required
                fullWidth
              />
            </div>
            <TextField
              fullWidth
              type="email"
              label="Email"
              value={applicant.email}
              onChange={(e) =>
                setApplicant({ ...applicant, email: e.target.value })
              }
              required
              style={{ marginBottom: "16px" }}
            />

            <TextField
              fullWidth
              label="Contact Cellphone"
              value={applicant.cellphone}
              onChange={(e) =>
                setApplicant({ ...applicant, cellphone: e.target.value })
              }
              required
              style={{ marginBottom: "16px" }}
            />

            <TextField
              fullWidth
              label="Contact Landline (If Applicable)"
              value={applicant.landline}
              onChange={(e) =>
                setApplicant({ ...applicant, landline: e.target.value })
              }
            />

            <Typography style={{ marginTop: "16px" }}>
              Your Current Age{" "}
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                value={applicant.age}
                onChange={(e) =>
                  setApplicant({ ...applicant, age: e.target.value })
                }
                required
                style={{ marginBottom: "16px" }}
              >
                <FormControlLabel
                  value="18+"
                  control={<Radio />}
                  label="Aged 18 or Older"
                />
                <FormControlLabel
                  value="17"
                  control={<Radio />}
                  label="Aged 17 (but 18 in less than 6 months)"
                />
                <FormControlLabel
                  value="other"
                  control={<Radio />}
                  label="Other"
                />
              </RadioGroup>
            </FormControl>

            <Typography style={{ marginTop: "16px" }}>
              Do you have a car drivers licence?
            </Typography>

            <FormControl fullWidth>
              <Select
                value={applicant.driversLicense}
                onChange={(e) =>
                  setApplicant({
                    ...applicant,
                    driversLicense: e.target.value,
                  })
                }
                required
              >
                <MenuItem value="Full License">Full License</MenuItem>
                <MenuItem value="Restricted License">
                  Restricted License
                </MenuItem>
                <MenuItem value="Learners License">Learners License</MenuItem>
                <MenuItem value="No License">No License</MenuItem>
              </Select>
            </FormControl>

            <Typography style={{ marginTop: "16px" }}>
              Do you have access to your own vehicle, suitable for transporting
              children, with current WOF and Rego?
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                value={applicant.accessToCar}
                onChange={(e) =>
                  setApplicant({
                    ...applicant,
                    accessToCar: e.target.value,
                  })
                }
                required
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
                <FormControlLabel
                  value="Other"
                  control={<Radio />}
                  label="Other (please explain below)"
                />
              </RadioGroup>
              {applicant.accessToCar === "Other" && (
                <TextField
                  fullWidth
                  type="text"
                  onChange={(e) =>
                    setApplicant({
                      ...applicant,
                      accessToCarOther: e.target.value,
                    })
                  }
                  placeholder="Please explain here"
                />
              )}
            </FormControl>

            <Typography style={{ marginTop: "16px" }}>
              Do you have a current First Aid Certificate / Are you willing to
              get one?{" "}
            </Typography>

            <FormControl component="fieldset">
              <RadioGroup
                value={applicant.firstAid}
                onChange={(e) =>
                  setApplicant({ ...applicant, firstAid: e.target.value })
                }
                required
              >
                <FormControlLabel
                  value="Yes"
                  control={<Radio />}
                  label="Yes, and it expires on"
                />
                {applicant.firstAid === "Yes" && (
                  <TextField
                    fullWidth
                    type="date"
                    value={applicant.firstAidExpiration}
                    onChange={(e) =>
                      setApplicant({
                        ...applicant,
                        firstAidExpiration: e.target.value,
                      })
                    }
                  />
                )}
                <FormControlLabel
                  value="No but willing"
                  control={<Radio />}
                  label="No but I am willing to get one"
                />
                <FormControlLabel
                  value="No but not willing"
                  control={<Radio />}
                  label="No but I am not willing to get one"
                />
                <FormControlLabel
                  value="Past one"
                  control={<Radio />}
                  label="I did one in the past but it is no longer current"
                />
              </RadioGroup>
              <div className="radio-comment">
                Note: First Aid Certificates are valid for 2 years after
                completion date
              </div>
            </FormControl>

            <Typography style={{ marginTop: "16px" }}>
              Do you have any criminal convictions?
            </Typography>

            <FormControl component="fieldset">
              <RadioGroup
                value={applicant.criminalConvictions}
                onChange={(e) =>
                  setApplicant({
                    ...applicant,
                    criminalConvictions: e.target.value,
                  })
                }
                required
              >
                <FormControlLabel
                  value="Yes"
                  control={<Radio />}
                  label="Yes, but they do not require explanation in relation to the Vulnerable Children's Act"
                />
                <FormControlLabel value="No" control={<Radio />} label="No" />
                <FormControlLabel
                  value="Yes but explain"
                  control={<Radio />}
                  label="Yes, but let me explain"
                />
              </RadioGroup>
              {applicant.criminalConvictions === "Yes but explain" && (
                <TextField
                  fullWidth
                  type="text"
                  onChange={(e) =>
                    setApplicant({
                      ...applicant,
                      criminalConvictionsExplain: e.target.value,
                    })
                  }
                  placeholder="Please explain here"
                />
              )}
              <div className="radio-comment">
                If you have any criminal convictions, we will need you to
                explain these to us to assess how these impact your ability to
                work with children as part of legislation relating to the
                Vulnerable Children's Act. Please provide explanation in the
                relevant field.
              </div>
            </FormControl>

            <Typography style={{ marginTop: "16px" }}>
              Have you completed a police check for any other employment /
              agency in the past 12 months?
            </Typography>

            <FormControl component="fieldset">
              <RadioGroup
                value={applicant.policeCheck}
                onChange={(e) =>
                  setApplicant({
                    ...applicant,
                    policeCheck: e.target.value,
                  })
                }
                required
              >
                <FormControlLabel
                  value="Yes copy"
                  control={<Radio />}
                  label="Yes, I can get a copy"
                />
                <FormControlLabel
                  value="Yes no copy"
                  control={<Radio />}
                  label="Yes, but I can not get a copy "
                />
                <FormControlLabel
                  value="No but willing"
                  control={<Radio />}
                  label="No, but I am willing to get one"
                />
                <FormControlLabel
                  value="No and not willing"
                  control={<Radio />}
                  label="No, and I am not willing to get one"
                />
                <FormControlLabel
                  value="Other"
                  control={<Radio />}
                  label="Other, please explain below"
                />
              </RadioGroup>

              {applicant.policeCheck === "Other" && (
                <TextField
                  fullWidth
                  type="text"
                  onChange={(e) =>
                    setApplicant({
                      ...applicant,
                      policeCheckOther: e.target.value,
                    })
                  }
                  placeholder="Please explain here"
                />
              )}
            </FormControl>

            <Typography style={{ marginTop: "16px" }}>
              Will you be staying in Dunedin for 1 year minimum or longer?
            </Typography>

            <FormControl component="fieldset">
              <RadioGroup
                value={applicant.dunedinStay}
                onChange={(e) =>
                  setApplicant({
                    ...applicant,
                    dunedinStay: e.target.value,
                  })
                }
                required
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
                <FormControlLabel
                  value="Other"
                  control={<Radio />}
                  label="Other (please describe below)"
                />
              </RadioGroup>

              {applicant.dunedinStay === "Other" && (
                <TextField
                  fullWidth
                  type="text"
                  onChange={(e) =>
                    setApplicant({
                      ...applicant,
                      dunedinStayOther: e.target.value,
                    })
                  }
                  placeholder="Please explain here"
                />
              )}
            </FormControl>

            <Typography style={{ marginTop: "16px" }}>
              Do you usually stay in Dunedin over the Summer Period (excluding
              less than any 3 weeks around the statutory holidays)?
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                value={applicant.summerPeriod}
                onChange={(e) =>
                  setApplicant({
                    ...applicant,
                    summerPeriod: e.target.value,
                  })
                }
                required
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel
                  value="No"
                  control={<Radio />}
                  label="No, I travel back to.."
                />
              </RadioGroup>

              {applicant.summerPeriod === "No" && (
                <TextField
                  fullWidth
                  type="text"
                  onChange={(e) =>
                    setApplicant({
                      ...applicant,
                      summerPeriodOther: e.target.value,
                    })
                  }
                  placeholder="Please explain here"
                />
              )}
              <div className="radio-comment">
                If no, please state where you usually travel to, or your other
                circumstances (if applicable)
              </div>
            </FormControl>

            <Typography style={{ marginTop: "16px" }}>
              Do you currently permanently live in Dunedin?
            </Typography>

            <FormControl component="fieldset">
              <RadioGroup
                value={applicant.permanentResidence}
                onChange={(e) =>
                  setApplicant({
                    ...applicant,
                    permanentResidence: e.target.value,
                  })
                }
                required
              >
                <FormControlLabel
                  value="Yes"
                  control={<Radio />}
                  label="Yes, I am already here"
                />
                <FormControlLabel
                  value="No"
                  control={<Radio />}
                  label="Not right at this moment, I am arriving on..."
                />
              </RadioGroup>
              {applicant.permanentResidence === "No" && (
                <TextField
                  fullWidth
                  type="date"
                  value={applicant.dunedinArrivalDate}
                  onChange={(e) =>
                    setApplicant({
                      ...applicant,
                      dunedinArrivalDate: e.target.value,
                    })
                  }
                />
              )}
            </FormControl>

            <Typography style={{ marginTop: "16px" }}>
              I would be available to start work from...
            </Typography>

            <TextField
              fullWidth
              type="date"
              value={applicant.startWork}
              onChange={(e) =>
                setApplicant({ ...applicant, startWork: e.target.value })
              }
              required
            />

            <Typography style={{ marginTop: "16px" }}>
              What kind/amount of work are you ideally looking for?
            </Typography>

            <FormControl fullWidth component="fieldset">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={applicant.amountOfWork.includes(
                      "Casual (as/when suits you)"
                    )}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setApplicant((prev) => ({
                          ...prev,
                          amountOfWork: [
                            ...prev.amountOfWork,
                            "Casual (as/when suits you)",
                          ],
                        }));
                      } else {
                        setApplicant((prev) => ({
                          ...prev,
                          amountOfWork: prev.amountOfWork.filter(
                            (skill) => skill !== "Casual (as/when suits you)"
                          ),
                        }));
                      }
                    }}
                    value="Casual"
                  />
                }
                label="Casual (as/when suits you)"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={applicant.amountOfWork.includes(
                      "Casual (4-10 hours per week)"
                    )}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setApplicant((prev) => ({
                          ...prev,
                          amountOfWork: [
                            ...prev.amountOfWork,
                            "Casual (4-10 hours per week)",
                          ],
                        }));
                      } else {
                        setApplicant((prev) => ({
                          ...prev,
                          amountOfWork: prev.amountOfWork.filter(
                            (skill) => skill !== "Casual (4-10 hours per week)"
                          ),
                        }));
                      }
                    }}
                    value="CasualHours"
                  />
                }
                label="Casual (4-10 hours per week)"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={applicant.amountOfWork.includes("Part Time")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setApplicant((prev) => ({
                          ...prev,
                          amountOfWork: [...prev.amountOfWork, "Part Time"],
                        }));
                      } else {
                        setApplicant((prev) => ({
                          ...prev,
                          amountOfWork: prev.amountOfWork.filter(
                            (skill) => skill !== "Part Time"
                          ),
                        }));
                      }
                    }}
                    value="Part Time"
                  />
                }
                label="Part Time"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={applicant.amountOfWork.includes("Full Time")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setApplicant((prev) => ({
                          ...prev,
                          amountOfWork: [...prev.amountOfWork, "Full Time"],
                        }));
                      } else {
                        setApplicant((prev) => ({
                          ...prev,
                          amountOfWork: prev.amountOfWork.filter(
                            (skill) => skill !== "Full Time"
                          ),
                        }));
                      }
                    }}
                    value="Full Time"
                  />
                }
                label="Full Time"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={applicant.amountOfWork.includes("Other")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setApplicant((prev) => ({
                          ...prev,
                          amountOfWork: [...prev.amountOfWork, "Other"],
                        }));
                      } else {
                        setApplicant((prev) => ({
                          ...prev,
                          amountOfWork: prev.amountOfWork.filter(
                            (skill) => skill !== "Other"
                          ),
                        }));
                      }
                    }}
                    value="Other"
                  />
                }
                label="Other"
              />
              <div className="radio-comment">
                Tick all that apply to your current circumstances (we understand
                these may change over time). If other - please explain in detail
                below
              </div>
              <TextField
                fullWidth
                type="text"
                onChange={(e) =>
                  setApplicant({
                    ...applicant,
                    amountOfWorkOther: e.target.value,
                  })
                }
                placeholder="Please explain here"
              />
            </FormControl>

            <Typography style={{ marginTop: "16px" }}>
              Are you looking for regular, ongoing work?
            </Typography>
            <FormControl fullWidth component="fieldset">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={applicant.regularShifts.includes("Yes")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setApplicant((prev) => ({
                          ...prev,
                          regularShifts: [...prev.regularShifts, "Yes"],
                        }));
                      } else {
                        setApplicant((prev) => ({
                          ...prev,
                          regularShifts: prev.regularShifts.filter(
                            (skill) => skill !== "Yes"
                          ),
                        }));
                      }
                    }}
                    value="Yes"
                  />
                }
                label="Yes (any)"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={applicant.regularShifts.includes(
                      "Yes Weekday Afternoons)"
                    )}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setApplicant((prev) => ({
                          ...prev,
                          regularShifts: [
                            ...prev.regularShifts,
                            "Yes Weekday Afternoons",
                          ],
                        }));
                      } else {
                        setApplicant((prev) => ({
                          ...prev,
                          regularShifts: prev.regularShifts.filter(
                            (skill) => skill !== "Yes Weekday Afternoons"
                          ),
                        }));
                      }
                    }}
                    value="Yes Weekday Afternoons"
                  />
                }
                label="Yes Weekday Afternoons (~2:30pm - ~6:00pm)"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={applicant.regularShifts.includes(
                      "Yes Weekday Mornings"
                    )}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setApplicant((prev) => ({
                          ...prev,
                          regularShifts: [
                            ...prev.regularShifts,
                            "Yes Weekday Mornings",
                          ],
                        }));
                      } else {
                        setApplicant((prev) => ({
                          ...prev,
                          regularShifts: prev.regularShifts.filter(
                            (skill) => skill !== "Yes Weekday Mornings"
                          ),
                        }));
                      }
                    }}
                    value="Yes Weekday Mornings"
                  />
                }
                label="Yes Weekday Mornings (~7:00am - ~9:00am)"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={applicant.regularShifts.includes(
                      "Yes Weekday Anytime"
                    )}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setApplicant((prev) => ({
                          ...prev,
                          regularShifts: [
                            ...prev.regularShifts,
                            "Yes Weekday Anytime",
                          ],
                        }));
                      } else {
                        setApplicant((prev) => ({
                          ...prev,
                          regularShifts: prev.regularShifts.filter(
                            (skill) => skill !== "Yes Weekday Anytime"
                          ),
                        }));
                      }
                    }}
                    value="Yes Weekday Anytime"
                  />
                }
                label="Yes Weekday Shifts (Anytime)"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={applicant.regularShifts.includes(
                      "Yes Weekend Anytime"
                    )}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setApplicant((prev) => ({
                          ...prev,
                          regularShifts: [
                            ...prev.regularShifts,
                            "Yes Weekend Anytime",
                          ],
                        }));
                      } else {
                        setApplicant((prev) => ({
                          ...prev,
                          regularShifts: prev.regularShifts.filter(
                            (skill) => skill !== "Yes Weekend Anytime"
                          ),
                        }));
                      }
                    }}
                    value="Yes Weekend Anytime"
                  />
                }
                label="Yes Weekend Shifts (Anytime)"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={applicant.regularShifts.includes("No casual")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setApplicant((prev) => ({
                          ...prev,
                          regularShifts: [...prev.regularShifts, "No casual"],
                        }));
                      } else {
                        setApplicant((prev) => ({
                          ...prev,
                          regularShifts: prev.regularShifts.filter(
                            (skill) => skill !== "No casual"
                          ),
                        }));
                      }
                    }}
                    value="No casual"
                  />
                }
                label="No, I just want casual work as/when it suits me"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={applicant.regularShifts.includes("Other")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setApplicant((prev) => ({
                          ...prev,
                          regularShifts: [...prev.regularShifts, "Other"],
                        }));
                      } else {
                        setApplicant((prev) => ({
                          ...prev,
                          regularShifts: prev.regularShifts.filter(
                            (skill) => skill !== "Other"
                          ),
                        }));
                      }
                    }}
                    value="Other"
                  />
                }
                label="Other (e.g. mixed availability, please state below)"
              />
              <div className="radio-comment">
                This would be shifts that you know you are scheduled to do. It
                could be weekly, fortnightly, or monthly. Not necessarily all
                afternoons, mornings, etc.
              </div>
              <TextField
                fullWidth
                type="text"
                onChange={(e) =>
                  setApplicant({
                    ...applicant,
                    regularShiftsOther: e.target.value,
                  })
                }
                placeholder="Please explain here"
              />
            </FormControl>

            <Typography style={{ marginTop: "16px" }}>
              Tell us about your current work / study status?
            </Typography>
            <TextField
              fullWidth
              value={applicant.currentWorkStatus}
              onChange={(e) =>
                setApplicant({
                  ...applicant,
                  currentWorkStatus: e.target.value,
                })
              }
              required
            />

            <Typography style={{ marginTop: "16px" }}>
              Do you have one or more referees that are from a context involving
              working with children? (Our policy is to contact 2 referees, 1
              minimum must be in a context working with children but preferably
              both are)
            </Typography>

            <FormControl component="fieldset">
              <RadioGroup
                value={applicant.referees}
                onChange={(e) =>
                  setApplicant({ ...applicant, referees: e.target.value })
                }
                required
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
                <FormControlLabel
                  value="No but other"
                  control={<Radio />}
                  label="No, but I do have..."
                />
              </RadioGroup>

              {applicant.referees === "No but other" && (
                <TextField
                  fullWidth
                  type="text"
                  onChange={(e) =>
                    setApplicant({
                      ...applicant,
                      refereesOther: e.target.value,
                    })
                  }
                  placeholder="Please explain here"
                />
              )}

              <div className="radio-comment">
                Please use the space provided to explain how your referees might
                still be suitable to meet our policy
              </div>
            </FormControl>

            {applicant.referees === "Yes" && (
              <div className="radio-comment">
                Fill in all spaces below and use N/A if not applicable. We
                require to be able to contact 2 referees, all must be from a
                working context, 1 minimum must be in a context working with
                children but preferably both. We also ask for a back up referee
                whom we will only contact if either of the others are
                unreachable. Please let your referees know to expect our call.
              </div>
            )}

            {applicant.referees === "Yes" && (
              <div className="question-section">
                {/* Referee table */}
                <div className="question-input">
                  <table className="referee-table">
                    <thead>
                      <tr>
                        <th></th>{" "}
                        {/* Empty cell for top-left corner of the table */}
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Relationship to you</th>
                        <th>Have you contacted them?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {["Referee 1", "Referee 2", "Referee 3 (optional)"].map(
                        (refereeLabel, rowIndex) => (
                          <tr key={rowIndex}>
                            <td className="row-header">{refereeLabel}</td>
                            {[
                              "name",
                              "email",
                              "phoneNumber",
                              "relationship",
                              "contacted",
                            ].map((field, colIndex) => (
                              <td key={field}>
                                <TextField
                                  size="small"
                                  value={localRefereeDetails[rowIndex][field]}
                                  onChange={(e) =>
                                    handleRefereeChange(
                                      rowIndex,
                                      field,
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                            ))}
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <Typography style={{ marginTop: "16px" }}>Cover Letter </Typography>
            <input type="file" id="coverLetterInput" />
            <br />
            {coverLetter && (
              <div>
                <Typography>Selected Cover Letter</Typography>
                <div>{coverLetter}</div>
                <br />
              </div>
            )}
            <div className="radio-comment">
              Please outline in the Cover Letter how your past experience meets
              the qualities we are looking for in the job description provided
            </div>

            <Typography style={{ marginTop: "16px" }}>
              {" "}
              Curriculum Vitae{" "}
            </Typography>
            <input type="file" id="cvInput" />
            <br />
            {curriculumVitae && (
              <div>
                <Typography>Selected Curriculum Vitae</Typography>
                <div>{curriculumVitae}</div>
                <br />
              </div>
            )}
            <div className="radio-comment">
              Please upload your up-to-date CV here
            </div>

            <br />
            <br />

            <Button type="submit" variant="contained" color="primary">
              Add Applicant
            </Button>
          </form>
        </Paper>
      </Container>
      {/* Notification component */}
      <Notification
        open={notificationOpen}
        message={notificationMessage}
        severity={notificationSeverity}
        onClose={handleNotificationClose}
      />
    </div>
  );
}

export default AddApplicant;
