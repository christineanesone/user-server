// ApplicantDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TextField } from "@mui/material";
import axiosInstance from "../api";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  IconButton,
  Button,
} from "@mui/material";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import Navbar from "../component/common/Nav_bar/Navbar";
import Sidebar from "../component/common/Side_bar/SideBar";
import StatusUpdateDialog from "../component/common/ApplicationProcess/StatusUpdateDialog";
import ScheduleDialog from "../component/common/ApplicationProcess/ScheduleDialog";
import UploadFileDialog from "../component/common/ApplicationProcess/UploadFileDialog";
import PDFViewDialog from "../component/common/ApplicationProcess/PDFViewDialog";
import UpdateEmploymentDialog from "../component/common/ApplicationProcess/UpdateEmploymentDialog";
import RefereeDialog from "../component/common/ApplicationProcess/RefereeDialog";
import EditNotesDialog from "../component/common/ApplicationProcess/EditNotesDialog";
import Notification from "../component/common/Notification/notification";

const ApplicantDetails = () => {
  const { applicantId } = useParams();
  const [applicantDetails, setApplicantDetails] = useState({});
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [firstTableData, setFirstTableData] = useState([]);
  const [isSecondTableExpanded, setIsSecondTableExpanded] = useState(false);
  const [secondTableData, setSecondTableData] = useState([]);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openEmploymentDialog, setOpenEmploymentDialog] = useState(false);
  const [openPDFViewDialog, setOpenPDFViewDialog] = useState(false);
  const [pdfContent, setPdfContent] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("InProgress");
  const [uploadDialogAttribute, setUploadDialogAttribute] = useState(null);
  const [statusDialogAttribute, setStatusDialogAttribute] = useState(null);
  const [openDialogRowIndex, setOpenDialogRowIndex] = useState(-1);
  const [shouldRefreshData, setShouldRefreshData] = useState(false);
  const [notes, setNotes] = useState(""); // Initialize the "notes" attribute
  const [openNotesDialog, setOpenNotesDialog] = useState(false); // Dialog open/close state
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationSeverity, setNotificationSeverity] = useState("info");
  const [faceToFaceInterviewDate, setInterviewDate] = useState(null);
  const [inductionDate, setInductionDate] = useState(null);

  const showNotification = (message, severity) => {
    setNotificationMessage(message);
    setNotificationSeverity(severity);
    setNotificationOpen(true);
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };

  useEffect(() => {
    const fetchApplicantDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/applicants/applicantsDetails/applicant/${applicantId}`
        );
        setApplicantDetails(response.data);

        const formattedFirstTableData = [
          {
            question: "Name",
            answer: `${response.data.firstName} ${response.data.middleName} ${response.data.lastName}`,
          },
          { question: "Email", answer: response.data.email },
          { question: "Cellphone", answer: response.data.cellphone },
          { question: "landline ", answer: response.data.landline },
          { question: "Age ", answer: response.data.age },
          {
            question: "Drivers License ",
            answer: response.data.driversLicense,
          },
          { question: "Access To Car ", answer: response.data.accessToCar },
          {
            question: "Access To Car Explained ",
            answer: response.data.accessToCarOther,
          },
          { question: "First Aid ", answer: response.data.firstAid },
          {
            question: "First Aid Expiration ",
            answer: response.data.firstAidExpiration,
          },
          {
            question: "Criminal Convictions ",
            answer: response.data.criminalConvictions,
          },
          {
            question: "Criminal Convictions Explain ",
            answer: response.data.criminalConvictionsExplain,
          },
          { question: "Police Check ", answer: response.data.policeCheck },
          {
            question: "Police Check Explain ",
            answer: response.data.policeCheckOther,
          },
          { question: "Dunedin Stay ", answer: response.data.dunedinStay },
          {
            question: "Dunedin Stay Other ",
            answer: response.data.dunedinStayOther,
          },
          { question: "Summer Period ", answer: response.data.summerPeriod },
          {
            question: "Summer Period Explain ",
            answer: response.data.summerPeriodOther,
          },
          {
            question: "Permanent Residence ",
            answer: response.data.permanentResidence,
          },
          {
            question: "Dunedin Arrival Date ",
            answer: response.data.dunedinArrivalDate,
          },
          {
            question: "Avaliable to Start Work ",
            answer: response.data.startWork,
          },
          { question: "Amount Of Work ", answer: response.data.amountOfWork },
          {
            question: "Amount Of Work Explain ",
            answer: response.data.amountOfWorkOther,
          },
          { question: "Regular Shifts ", answer: response.data.regularShifts },
          {
            question: "Regular Shifts Other ",
            answer: response.data.regularShiftsOther,
          },
          {
            question: "Current Work Status ",
            answer: response.data.currentWorkStatus,
          },
          { question: "Referees ", answer: response.data.referees },
          { question: "Referees Other ", answer: response.data.refereesOther },
          {
            question: "Referee Information ",
            answer: response.data.refereeInformation,
          },
          { question: "Cover Letter", answer: "" },
          {
            question: "Curriculum Vitae",
            answer: "",
          },
        ];

        setFirstTableData(formattedFirstTableData);

        //Note the names after response.data. - they are what are needed to be added to the schema
        const formattedSecondTableData = [
          {
            question: "Application Status",
            answer: response.data.applicationStatus,
          },
          {
            question: "Phone Interview",
            answer: response.data.phoneInterviewStatus,
          },
          {
            question: "Pre-Interview Information",
            answer: response.data.additionalInformationStatus,
          },
          {
            question: "Face-to-Face Interview",
            answer: response.data.faceToFaceInterviewStatus,
          },
          { question: "Police Check", answer: response.data.policeCheckStatus },
          { question: "Reference Check", answer: response.data.referees },
          { question: "Schedule Induction", answer: response.data.inductionStatus },
          { question: "Issued with Equipment", answer: response.data.equipmentStatus },
          { question: "Employment Status", answer: response.data.role }
        ];

        setSecondTableData(formattedSecondTableData);
      } catch (error) {
        console.log(error);
      }
    };

    if (shouldRefreshData || applicantId) {
      fetchApplicantDetails();
    }

    // Reset shouldRefreshData to false after data refresh
    if (shouldRefreshData) {
      setShouldRefreshData(false);
    }
  }, [applicantId, shouldRefreshData]);

  //For the expansion of the tables
  const toggleTable = () => {
    setIsTableExpanded(!isTableExpanded);
  };

  const toggleSecondTable = () => {
    setIsSecondTableExpanded(!isSecondTableExpanded);
  };

  //For face to face interview dates
  const handleSaveInterviewDate = async () => {
    if (faceToFaceInterviewDate) {
      try {
        await axiosInstance.put(
          `/api/applicants/saveInterviewDate/applicant/${applicantId}`,
          { faceToFaceInterviewDate }
        );

        // Update local state or refetch data if necessary
        setShouldRefreshData(true); // If this triggers a refetch of applicant data
        showNotification("Date saved successfully", "success");
      } catch (error) {
        console.log(error);
        showNotification("Error updating interview date:", "error");
        console.error("Error updating interview date:", "error");
      }
    } else {
      showNotification("No date selected");
      console.warn("No date selected");
    }
  };

  //For induction date
  const handleSaveInductionDate = async () => {
    if (inductionDate) {
      try {
        await axiosInstance.put(
          `/api/applicants/saveInductionDate/applicant/${applicantId}`,
          { inductionDate }
        );

        // Update local state or refetch data if necessary
        setShouldRefreshData(true); // If this triggers a refetch of applicant data
        showNotification("Date saved successfully", "success");
      } catch (error) {
        console.log(error);
        showNotification("Error updating interview date:", "error");
        console.error("Error updating interview date:", "error");
      }
    } else {
      showNotification("No date selected");
      console.warn("No date selected");
    }
  };

  //For the status update dialog box
  const handleOpenDialog = (question) => {
    let attribute = "";

    if (question === "Application Status") {
      attribute = "applicationStatus";
    } else if (question === "Phone Interview") {
      attribute = "phoneInterviewStatus";
    } else if (question === "Pre-Interview Information") {
      attribute = "additionalInformationStatus";
    } else if (question === "Face-to-Face Interview") {
      attribute = "faceToFaceInterviewStatus";
    } else if (question === "Police Check") {
      attribute = "policeCheckStatus";
    } else if (question === "Reference Check") {
      attribute = "referenceCheckStatus";
    } else if (question === "Schedule Induction") {
      attribute = "inductionStatus";
    } else if (question === "Issued with Equipment") {
      attribute = "equipmentStatus";
    }

    // Set the attribute and log it
    setStatusDialogAttribute(attribute);
    setOpenDialogRowIndex(true);
  };

  const handleCloseDialog = () => {
    setStatusDialogAttribute(null);
    setOpenDialogRowIndex(-1);
    setShouldRefreshData(true);
  };

  const handleOpenEmploymentDialog = () => {
    setOpenEmploymentDialog(true);
  };

  const handleCloseEmploymentDialog = () => {
    setOpenEmploymentDialog(false);
    setShouldRefreshData(true);
  };


  //For the referee dialog
  const [openRefereeDialog, setOpenRefereeDialog] = useState(false);
  const [selectedReferees, setSelectedReferees] = useState([]);

  const saveRefereesToDatabase = async (selected) => {
    try {
      const response = await axiosInstance.post(`/api/applicants/saveReferees/applicant/${applicantId}`, {
        applicantId,
        selectedReferees: selected,
      
      });
      // //if (response.data.success) {
      //   showNotification("Date saved successfully", "success");
      // } else {
      //   showNotification('Error updating:', "error");
      // }
    } catch (error) {
      console.error("Error saving referees:", error);
      showNotification("Error updating:", "error");
    }
  };

  const handleCloseRefereeDialog = () => {
    setOpenRefereeDialog(false);
    setShouldRefreshData(true);
  };

  //PDF Handles Upload then viewer
  const handleOpenUploadDialog = (question) => {
    let attribute = "";

    if (question === "Phone Interview") {
      attribute = "phoneInterviewStatus";
    } else if (question === "Pre-Interview Information") {
      attribute = "additionalInformationStatus";
    } else if (question === "Face-to-Face Interview") {
      attribute = "faceToFaceInterviewStatus";
    }

    setUploadDialogAttribute(attribute);
    console.log(uploadDialogAttribute);
    setOpenUploadDialog(true);
  };

  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
    setUploadDialogAttribute(null);
  };

  const handleOpenPDFViewDialog = async (question) => {
    let attribute = "phoneInterviewNotes";
    if (question === "Phone Interview") {
      attribute = "phoneInterviewNotes";
    } else if (question === "Pre-Interview Information") {
      attribute = "additionalInformation";
    } else if (question === "Face-to-Face Interview") {
      attribute = "faceInterviewNotes";
    } else if (question === "Cover Letter") {
      attribute = "coverLetter";
    } else if (question === "Curriculum Vitae") {
      attribute = "curriculumVitae";
    }

    // Pulling data
    try {
      const response = await axiosInstance.get(
        `/api/users/getPDF/${applicantId}?attribute=${attribute}`
      );

      console.log("View Handler Reached")
      console.log(response)
      if (response.data.pdfBuffer && response.data.fileName) {
        setPdfContent(response.data.pdfBuffer);
        setFileName(response.data.fileName); // Store the file name in your state
        setOpenPDFViewDialog(true);
      } else if (response.data.message === "No file available") {
        // Notification for no file available
        showNotification('No file available for this attribute', 'info');
      } else if (response.data.message === "Invalid file format") {
        // Notification for invalid file format
        showNotification('The file uploaded is not in .pdf format', 'warning');
      } else {
        // Some other error
        console.error('Unexpected error fetching PDF content.');
      }
    } catch (error) {
      // Generic error handling
      showNotification('Error - Please add a PDF file first.', 'error');
      console.error('Error fetching PDF content:', error);
    }
  };


  const handleClosePDFViewDialog = () => {
    setOpenPDFViewDialog(false);
  };

  //Notes Dialog Handlers
  const handleOpenEditDialog = () => {
    setNotes(applicantDetails.notes);
    console.log("Handler:", notes);
    setOpenNotesDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenNotesDialog(false);
    setShouldRefreshData(true);
  };

  //EMAILS
  //Employment email
  const handleContractEmail = (email) => {
    const subject = "Employment Contract";
    const body = `Hi ${applicantDetails.firstName},

Please see attached your employment contract. Please email this contract back as soon as possible with your signature.

Do let us know if you have any further questions.


Kind Regards,
Administration (Annabelle & Charlotte),
Belle Babysitters Ltd.

Call: 0800 235532 (BELLEB)
Text: 0225 235532 (BELLEB)
Website: http://www.bellebabysitters.co.nz 
Facebook: https://www.facebook.com/belle.babysitters 
Twitter: https://twitter.com/bellebabysitter
Belle Babysitting`;

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  //Application recieved email
  const handleApplicationRecievedEmail = (email) => {
    const subject = "Belle Babysitters Application Recieved";
    const body = `Hi ${applicantDetails.firstName},

    This is confirmation we have received your application. 
    
    We will review your application and contact you about your application and the next steps shortly approximately (tbc)  days. 
    
    If you have not heard from us by that time feel free to touch base with us to check your application status.

    Kind regards,
    
    Administration (Annabelle & Charlotte),
    Belle Babysitters Ltd.

Call: 0800 235532 (BELLEB)
Text: 0225 235532 (BELLEB)
Website: http://www.bellebabysitters.co.nz 
Facebook: https://www.facebook.com/belle.babysitters 
Twitter: https://twitter.com/bellebabysitter
Belle Babysitting`;

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  //Pre-warning phone interview email
  const handlePhoneInterviewEmail = (email) => {
    const subject = "Phone Interview Scheduling";
    const body = `Hi ${applicantDetails.firstName},

This email is just a heads up that I will be doing some phone interview phone calling in the coming few days.

This will be relatively casual - let us know if you are aware of any particular times that will not work for you.


Regards,
Belle Babysitting`;

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  //Induction email
  const handleInductionEmail = (email) => {
    const subject = "Induction Scheduling";
    const body = `Hi ${applicantDetails.firstName},

    Thank you for your patience. Congratulations! This is to inform you that both your referee checks are now complete, (your police check is still pending but should hopefully be back soon, we have assumed it will come back clear), and if so we would like to welcome you to join our babysitting team. If you applied through SJS you may sometime soon receive a separate email from SJS about being offered this job, but this is for their records only, sorry for the double-up but DO please click to accept the offer for SJS records assuming you do accept. If you do not wish to use the default photo (see attached) taken of you at the interview for your I.D. card and website profile, please find a suitable photo of yourself (ideally with a plain light coloured background) and think about creating a mini profile so that we can put you on our website (you can see the ones others have made on our website http://www.bellebabysitters.co.nz under "our babysitters"). Although we will cover this further during the induction if you would like to wait until then so you have some extra guidance.

    The next step of the process is to arrange a time for the induction, which should have been described to you in the interview. It is anticipated this will take about 2.5 - 3hours in duration in a small group setting. The proposed first semester induction dates have been set out below (NOTE: attendance is only required for one session), SO to start getting work as soon as possible try and attend the earliest induction date convenient to you... Please note: You will not be able to complete work for us until this has been completed and beyond the dates listed below it is possible none will run again until late July/ early August 2023. Please use the following link to choose the ones you can attend WhenAvailable - Find When Works! (Please: Note: We are only planning to run two of these sessions below so please choose all that you can attend to ensure we select the dates that suit the most people (you will get a confirmation email for which ones will run), hence you will have to provide you name and email as the first step of the link.
    
    1) Sunday the 26th of  February, 4.30pm - 7.30pm.
    
     2) Saturday the 4th of  March, 11.30am - 2.30pm.
    
    3) Sunday the 5th of March, 11.30am - 2.30pm.
    
    4) Sunday the 5th of March, 4.30pm - 7.30pm.
    
    
    The inductions will be held at a new location for us. The address is Dunedin Kindergarten HQ, 81 Forbury Road, St Clair, Dunedin 9012. A Belle Babysitters laminated sheet on the "Staff ONLY" gate (Note: there are multiple entrances) should identify you are in the correct location but please note: This is our first time using this location and the doors may be automatically locked until Annabelle lets everyone in as this is outside of typical office hours, and she will need to escort you to the room (due to her security and Health and Safety obligations). If you are having any issues finding or accessing the building just text/call her 0225235532.
    
    We will offer you non-alcoholic drinks (tea/coffee/hot chocolate/juice and water), and some nibbles. We anticipate the sessions to last about 2.5 hours but allow for them to run up to 30 minutes longer when organizing any other commitments. The format of the session is semi-formal, you will mostly get to listen to Annabelle talk about various things that relate to the business and your role in it, but you may also be expected to discuss things with the others in attendance also. There is some documentation to complete at the beginning of the session so being up to 10minutes early could help you leave earlier at the end.
    
    We will need copies of some documents for our records (if you haven't already provided us with these) please ensure you send (via email) copies to us or bring copies with you, If you have already uploaded copies you do not need to provide them again (unless you have updated any of them).
    
    * First Aid Certificate (original or witnessed copies acceptable)
    * Current Drivers Licence
    * Any relevant Teaching/Nannying/Childcare/Coaching qualifications or Teaching Registration Documents (original or witnessed copies acceptable).
    
    Further regarding your I.d. photo (mentioned above), if you wish to send us a different one, we will need your other photo emailed to us at least 24 hours PRIOR to your chosen induction time (otherwise your default photo will be used). You would need to email us a suitable head and shoulders photo of yourself approximately 3x3cm square (although we can usually edit this). On a side note, the photo we use on the website can be updated anytime if you email us the one you wish to have there.
    
    
    FIRST AID COURSE INFO: (If you don't have one or yours has expired)...
    
    We have negotiated with Meditrain Otago (First Aid Solutions) that you can attend the morning 8.30am - 12.30pm component of ANY of their public first aid courses to achieve our minimum requirement Child First Aid qualification at the cost of $70 (current rate as at 1st January 2023). You will need to email or phone them directly to book onto a course and explain that you are doing a Child First Aid Course for Belle Babysitters. You can choose any date which suits you that still has space available using the link below (Once you have picked a date phone or email them directly to confirm, their online booking form is NOT set up for our arrangement with Meditrain Otago).
    
    First Aid Courses & Training for Kiwis - Meditrain - Since 1991 
    
    
    
    
    The course you will receive credit for is the Child First Aid Course see further information here Child First Aid It lasts for 2 years but has slightly different NZQA credits to the typical First Aid Course. If you need it for another purpose please ring Meditrain to figure out your options for the other more typical course/s. The Full course for other purposes is longer (3.30pm finish) and currently costs $110ish (possibly more) for students. 
    
    Please Note: They are able to accredit you with the Child First Aid component within their (Basic First Aid Course) I.e. So you are essentially doing the First 4 hours of the full course, and so by choosing this option you get a bonus hour of content as the content of the Child First Aid course is delivered within the full course content, but the benefit of this (in addition to the bonus material you get for free, is you are able to choose the date that best suits you). 
    
    Current Ongoing Jobs Available:
    We have a couple of jobs currently available (although others may be added/removed on your induction day as applicable).
    
    EXAMPLE JOBS:
    1) Anderson's Bay area - Weekly 5x weekday Monday Through Friday afternoons 2.45pm - 5.45pmish and mornings 7.30am - 9amish Wednesday and Friday (other mornings may be available if desired) Job share an option if you can do 2-3 days. Twins BG5 and G2 (walking distance to school/day care 2x blocks no car/driving required). Start date ASAP.
    2) Anderson's Bay Area, Mornings Tuesday/Wednesday 7.15am - 9.15am G16, G11 (mild autism diagnosis), G9 (possibly ADHD Diagnosis). (Back up for other mornings also helpful). Driving to schools required (Anderson's Bay and Tahuna Intermediate) - Oldest child takes care of herself. (Start date by negotiation).
    3) A number of other families need a variety of support in the after school timeframe (varying from 2.30/3pmish to 5pm/6.30pmish) some jobs are 2x afternoons per week and others are more, some can be shared across candidates. If you have interest/availability in these types of shifts please let us know.
    
    
    
    In summary, please let us know: 
    1) Which induction session/s you can attend via this link provided ---> WhenAvailable - Find When Works! 
    
    WhenAvailable - Find When Works
    Entering your availability is quick and easy and does not require you to sign-in.
    
    
    
    and via email...
    2) Let us know if you are interested in of the listed jobs or generally interested in any before school or after school care jobs.
    3) Also that we have attached the correct photo of you / or send us your preferred one, 
    4) Please let us know if you have any other queries.
    
    If you have any urgent queries about either the induction / first aid course please text us.


Kind Regards,
Administration (Annabelle & Charlotte),
Belle Babysitters Ltd.

Call: 0800 235532 (BELLEB)
Text: 0225 235532 (BELLEB)
Website: http://www.bellebabysitters.co.nz 
Facebook: https://www.facebook.com/belle.babysitters 
Twitter: https://twitter.com/bellebabysitter
Belle Babysitting`;

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  //Zoom interview email
  const handleSendFaceInterviewEmail = (email) => {
    const subject = "Zoom Interview Invitation";
    const body = `Hi ${applicantDetails.firstName},

  Lovely to speak with you today. Here are the two links you need before the next step of our process, the Face to Face (Zoom) interview. This first one should allow you to select a 45minute time slot out of out currently available slots. If none of them suit for whatever reason you will need to let us know.

  https://calendly.com/bellebabysitters/45-minute-face-to-face-interview 

  This next one should take you to the form I mentioned that you need to read and submit further information to us. There is one small correction, that is the general pay rate is now starting at $26 per hour and the public holiday/short notice rate is $26 - $30 per hour (We are in the process of correcting this error). Please complete this form prior to your scheduled interview time slot.

  https://www.emailmeform.com/builder/form/Rez6ets2NC 


  Please email/text if you have any issues (I know it’s a bit clunky, it’s our first attempt at Covid proofing our recruitment process).

  Kind regards,

  Administration (Annabelle & Charlotte),
  Belle Babysitters Ltd.

  Call: 0800 235532 (BELLEB)
  Text: 0225 235532 (BELLEB)
  Website: http://www.bellebabysitters.co.nz 
  Facebook: https://www.facebook.com/belle.babysitters 
  Twitter: https://twitter.com/bellebabysitter

  This is your email for inductions


  Regards,
  Belle Babysitting`;

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  //Induction email
  const handleSendConfirmationEmail = (email) => {
    const subject = "Zoom Interview Confirmation";
    const body = `Hi ${applicantDetails.firstName},

    Please complete the form at the following link prior to your scheduled interview time slot of TIMEa/pm DAY DATE MONTH.
    
    https://www.emailmeform.com/builder/form/Rez6ets2NC 
    
    
    Kind Regards,
    
    Administration (Annabelle & Charlotte),
    Belle Babysitters Ltd.
    
    Call: 0800 235532 (BELLEB)
    Text: 0225 235532 (BELLEB)
    Website: http://www.bellebabysitters.co.nz
    Facebook: https://www.facebook.com/belle.babysitters
    Twitter: https://twitter.com/bellebabysitter`;

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  //Email employees temporary login details
  const handleEmployeeSignUp = async (email) => {
      const subject = "Signup link for Belle Babysitter's Employees";
      const body = `Hi ${applicantDetails.firstName},
  
        Now that you are an employee with Belle Babysitters, we are keen for you to signup to our system.

        Please see the link, and create yourself a login: 

        Please ensure you use the same email to signup that we have been using to communicate with over the rest of the application process.
        If you would prefer to use another email, do not hesitate to contact us about this.
 
        Kind Regards,
        
        Administration (Annabelle & Charlotte),
        Belle Babysitters Ltd.
        
        Call: 0800 235532 (BELLEB)
        Text: 0225 235532 (BELLEB)
        Website: http://www.bellebabysitters.co.nz
        Facebook: https://www.facebook.com/belle.babysitters
        Twitter: https://twitter.com/bellebabysitter`;

      const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoLink;
  };

  //To show custom buttons in each row of the application process table
  const renderButtonsForRow = (question) => {
    switch (question) {
      case "Cover Letter":
        return (
          <>
            <Button onClick={() => handleOpenPDFViewDialog(question)}>
              View{" "}
            </Button>
          </>
        );
      case "Curriculum Vitae":
        return (
          <>
            <Button onClick={() => handleOpenPDFViewDialog(question)}>
              View{" "}
            </Button>
          </>
        );
      case "Application Status":
        return (
          <>
            <Button onClick={() => handleOpenDialog(question)}>
              {" "}
              Status{" "}
            </Button>
            <Button
              onClick={() =>
                handleApplicationRecievedEmail(applicantDetails.email)
              }
            >
              Application received{" "}
            </Button>
          </>
        );
      case "Reference Check":
        return (
          <>
            
            <Button onClick={() => setOpenRefereeDialog(true)}> Update Referees Collected </Button>

          </>
        );
      case "Police Check":
      case "Issued with Equipment":
        return (
          <Button onClick={() => handleOpenDialog(question)}>
            {" "}
            Status{" "}
          </Button>
        );
      case "Phone Interview":
        return (
          <>
            <Button onClick={() => handleOpenDialog(question)}> Status </Button>
            <Button onClick={() => handlePhoneInterviewEmail(applicantDetails.email)}>Send Notice</Button>
            <Button onClick={() => handleOpenUploadDialog(question)}>Add Document</Button>
            <Button onClick={() => handleOpenPDFViewDialog(question)}>View</Button>
          </>
        );
      case "Face-to-Face Interview":
        return (
          <>
            <Button onClick={() => handleOpenDialog(question)}>
              {" "}
              Status{" "}
            </Button>
            <Button
              onClick={() => 
                handleSendConfirmationEmail(applicantDetails.email)
              }
            >
              Invite
            </Button>
            <Button onClick={() => handleOpenUploadDialog(question)}>
              Add Document
            </Button>
            <Button onClick={() => handleOpenPDFViewDialog(question)}>
              View 
            </Button>
            <TextField
              label="Interview Date"
              type="date"
              value={applicantDetails.faceToFaceInterviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Button onClick={() => handleSaveInterviewDate()}>Save Date</Button>
          </>
        );
      case "Pre-Interview Information":
        return (
          <>
            <Button onClick={() => handleOpenDialog(question)}>
              {" "}
              Status{" "}
            </Button>
            <Button
              onClick={() =>
                handleSendFaceInterviewEmail(applicantDetails.email)
              }
            >
              Invite
            </Button>
            <Button onClick={() => handleOpenUploadDialog(question)}>
              Add Document
            </Button>
            <Button onClick={() => handleOpenPDFViewDialog(question)}>
              View
            </Button>
          </>
        );
      case "Schedule Induction":
        return (
          <>
            <Button onClick={() => handleOpenDialog(question)}> Status </Button>
            <Button onClick={() => handleInductionEmail(applicantDetails.email)}>Invite</Button>
            <TextField
              label="Induction Date"
              type="date"
              value={applicantDetails.inductionDate || ""}
              onChange={(e) => setInductionDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Button onClick={() => handleSaveInductionDate()}>Save Date</Button>
          </>
        );
      case "Employment Status":
        return (
          <>
            <Button onClick={() => handleOpenEmploymentDialog(question)}> Status </Button>
            <Button onClick={() => handleContractEmail(applicantDetails.email)}>Send Contract</Button>
            <Button onClick={() => handleEmployeeSignUp(applicantDetails.email)}> Employee Sign Up</Button>
          </>
        );
    }
  };

  return (
    <div className="page-container">
      <Sidebar />
      <Navbar />
      <Container style={{ marginRight: "40px" }}>
        <Typography variant="h4">Applicant Details</Typography>
        <TableContainer component={Paper} style={{ marginTop: "20px" }}>
          <Table>
            <TableBody>
              {firstTableData
                .slice(0, isTableExpanded ? firstTableData.length : 3)
                .map((row) => (
                  <TableRow key={row.question}>
                    <TableCell>{row.question}</TableCell>
                    <TableCell>{row.answer}</TableCell>
                    <TableCell>{renderButtonsForRow(row.question)}</TableCell>
                  </TableRow>
                ))}

              {isTableExpanded &&
                firstTableData.slice(31).map((row) => (
                  <TableRow key={row.question}>
                    <TableCell>{row.question}</TableCell>
                    <TableCell>{row.answer}</TableCell>
                    <TableCell>{renderButtonsForRow(row.question)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          <TableCell align="center" colSpan={2}>
            <IconButton onClick={toggleTable}>
              {isTableExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </TableCell>
        </TableContainer>

        <Typography variant="h4" style={{ marginTop: "30px" }}>
          Application Process
        </Typography>

        <TableContainer component={Paper} style={{ marginTop: "10px" }}>
          <Table>
            <TableBody>
              {secondTableData
                .slice(0, isSecondTableExpanded ? secondTableData.length : 3)
                .map((row) => (
                  <TableRow key={row.question}>
                    <TableCell>{row.question}</TableCell>
                    <TableCell>{row.answer}</TableCell>
                    <TableCell>{renderButtonsForRow(row.question)}</TableCell>
                  </TableRow>
                ))}

              {isSecondTableExpanded &&
                secondTableData.slice(9).map((row) => (
                  <TableRow key={row.question}>
                    <TableCell>{row.question}</TableCell>
                    <TableCell>{row.answer}</TableCell>
                    <TableCell>{renderButtonsForRow(row.question)}</TableCell>
                  </TableRow>
                ))}

              <StatusUpdateDialog
                open={openDialogRowIndex !== -1}
                onClose={handleCloseDialog}
                applicantId={applicantId}
                attribute={statusDialogAttribute}
                setSelectedStatus={setSelectedStatus}
              />

              <RefereeDialog
                open={openRefereeDialog}
                onClose={handleCloseRefereeDialog}
                onSave={(selected) => {
                  setSelectedReferees(selected);
                  // Call an API to save the data
                  saveRefereesToDatabase(selected);
                  console.log(selected);
                }}
              />

              <UpdateEmploymentDialog
                open={openEmploymentDialog}
                onClose={handleCloseEmploymentDialog}
                applicantId={applicantId}
              />

              <UploadFileDialog
                open={openUploadDialog}
                onClose={handleCloseUploadDialog}
                applicantId={applicantId}
                attribute={uploadDialogAttribute}
              />

              {pdfContent !== null && (
                <PDFViewDialog
                  open={openPDFViewDialog}
                  onClose={handleClosePDFViewDialog}
                  pdfContent = {pdfContent}
                  fileName = {fileName}
                >
                </PDFViewDialog>
              )}

              <TableRow>
                <TableCell colSpan={2}>
                  <IconButton onClick={toggleSecondTable}>
                    {isSecondTableExpanded ? (
                      <KeyboardArrowUp />
                    ) : (
                      <KeyboardArrowDown />
                    )}
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Notification
          open={notificationOpen}
          message={notificationMessage}
          severity={notificationSeverity}
          onClose={handleNotificationClose}
        />

        {/* Large Box for Displaying Notes */}
        <Typography variant="h4" style={{ marginTop: "20px" }}>
          Notes
        </Typography>
        <TableContainer component={Paper} style={{ marginTop: "10px" }}>
          <div style={{ border: "1px solid #ccc", padding: "10px" }}>
            <div style={{ minHeight: "200px", marginBottom: "10px" }}>
              {applicantDetails.notes}
            </div>
          </div>
        </TableContainer>
        <Button onClick={handleOpenEditDialog}>Edit</Button>

        <EditNotesDialog
          open={openNotesDialog}
          onClose={handleCloseEditDialog}
          applicantId={applicantId}
          notes={notes}
        />
      </Container>
    </div>
  );
};

export default ApplicantDetails;
