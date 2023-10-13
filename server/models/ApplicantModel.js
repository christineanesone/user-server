const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const applicantSchema = new mongoose.Schema(
  {
    // Personal Information
    firstName: String,
    middleName: String,
    lastName: String,

    // Contact Information
    email: String,
    cellphone: String,
    landline: String,

    // Other Details
    age: String,
    driversLicense: String,
    accessToCar: String,
    accessToCarOther: String,
    firstAid: String,
    firstAidExpiration: String,
    criminalConvictions: String,
    criminalConvictionsExplain: String,
    policeCheck: String,
    policeCheckOther: String,
    policeCheckExpiry: String,
    dunedinStay: String,
    dunedinStayOther: String,
    summerPeriod: String,
    summerPeriodOther: String,
    permanentResidence: String,
    dunedinArrivalDate: String,
    startWork: String,
    amountOfWorkOther: String,
    regularShiftsOther: String,
    notes: String,

    // Arrays
    amountOfWork: [String],
    regularShifts: [String],

    // Work Status
    currentWorkStatus: String,

    // References
    referees: String,
    refereesOther: String,
    refereeInformation: String,

    selectedReferees: String,

    // Application Documents
    coverLetter: {
      fileName: String,
      data: Buffer //store pdf data as buffer
    },

    curriculumVitae: {
      fileName: String,
      data: Buffer
    },

    additionalInformation: {
      fileName: String,
      data: Buffer // Store PDF data as a Buffer
    },

    faceInterviewNotes: {
      fileName: String,
      data: Buffer  // Store PDF data as a Buffer
    },

    phoneInterviewNotes: {
      fileName: String,
      data: Buffer  // Store PDF data as a Buffer
    },

    //Status
    startWorkStatus: {
      type: String,
      default: "Applicant" 
    },

    referencesCollected: {
      type: String,
      default: "0" 
    },

    faceToFaceInterviewDate: {
      type: String,
      default: ""
    },

    inductionDate: {
      type: String,
      default: ""
    },

    applicationStatus: {
      type: String,
      default: "In Progress" 
    },

    phoneInterviewStatus: {
      type: String,
      default: "In Progress" 
    },

    additionalInformationStatus: {
      type: String,
      default: "Nil" 
    },

    faceToFaceInterviewStatus: {
      type: String,
      default: "In progress" 
    },

    policeCheckStatus: {
      type: String,
      default: "In progress" 
    },

    referenceCheckStatus: {
      type: String,
      default: "In progress" 
    },

    inductionStatus: {
      type: String,
      default: "In progress" 
    },

    equipmentStatus: {
      type: String,
      default: "In progress" 
    },

    phoneInterviewSchedule: {
      type: String,
      default: "Nil" 
    },

    inductionSchedule: {
      type: String,
      default: "Nil" 
    },

    policeExpiryDate: {
      type: String,
      default: "" 
    },

    employeeBlurb: {
      type: String,
      default: "N/A" 
    },

    role: {
      type: String,
      default: "Applicant" 
    }

  },
  { timestamps: true }
);

// "applicant" = mongodbCollection
const ApplicantModel = mongoose.model("applicant", applicantSchema);

module.exports = ApplicantModel;
