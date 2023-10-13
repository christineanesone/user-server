const express = require("express");
const router = express.Router();
const multer = require("multer");
const ApplicantModel = require("../../models/ApplicantModel");

const {
  addApplicant,
  getAllApplicants,
  getApplicantDetails,
  updateApplicantAttribute,
  getFirstAidExpiration,
  saveInterviewDate,
  saveInductionDate,
  saveReferees
} = require("../../controllers/admin/applicant/applicant");

router.get("/applicant", getAllApplicants);
router.post("/add-applicant", addApplicant);
router.get(
  "/applicantsDetails/applicant/:applicantId",
  getApplicantDetails
);
router.get(
  "/applicantsDetails/applicant/firstAidExpiration",
  getFirstAidExpiration
);
router.put(
  "/applicant/updateStatus/:applicantId",
  updateApplicantAttribute
);

router.put('/saveInterviewDate/applicant/:applicantId', saveInterviewDate);
router.put('/saveInductionDate/applicant/:applicantId', saveInductionDate);
router.post('/saveReferees/applicant/:applicantId', saveReferees);


module.exports = router;
