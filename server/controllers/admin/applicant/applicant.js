const jwt = require("jsonwebtoken");
const ApplicantModel = require("../../../models/ApplicantModel");
const UserModel = require("../../../models/UserModel");
const ErrorResponse = require("../../../utils/errorResponse");

// @desc    Create an applicant
// @route   POST /api/applicants/add-applicant
// @access  Private
exports.addApplicant = async (req, res, next) => {
  try {
    const applicantData = req.body;

    // Check if an applicant with the same email already exists
    const applicantExists = await ApplicantModel.findOne({
      email: applicantData.email,
    });
    if (applicantExists) {
      return next(
        new ErrorResponse("An applicant with that email already exists", 400)
      );
    }

    // Create a new applicant using the ApplicantModel
    const newApplicant = await ApplicantModel.create(applicantData);

    res.status(201).json({
      success: true,
      applicant: newApplicant
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// @desc    Get all applicants
// @route   GET /api/applicants/applicant
// @access  Private
exports.getAllApplicants = async (req, res) => {
  try {
    const applicants = await ApplicantModel.find({});
    res.json(applicants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get applicant details
// @route   GET /api/applicants/applicantsDetails/applicant/:applicantId
// @access  Private
exports.getApplicantDetails = async (req, res) => {
  try {
    const { applicantId } = req.params;
    const applicant = await ApplicantModel.findById(applicantId);
    if (!applicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }
    res.json(applicant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update applicant status
// @route   PUT /api/applicants/applicant/updateStatus/:applicantId
// @access  Private
exports.updateApplicantAttribute = async (req, res) => {
  const applicantId = req.params.applicantId;
  const { attribute, updatedStatus } = req.body;

  console.log(req.body);

  // Dynamically construct the update object based on attribute name
  const update = {};
  update[attribute] = updatedStatus;
  console.log("Update Object:", update);

  try {
    const updatedApplicant = await ApplicantModel.findByIdAndUpdate(
      applicantId,
      update,
      { new: true }
    );
    console.log("SUCCESS");

    if (!updatedApplicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    res.json(updatedApplicant);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("Controller not working");
  }
};

// @desc    Get first aid expiry
// @route   GET /api/applicants/applicantsDetails/applicant/firstAidExpiration
// @access  Private
exports.getFirstAidExpiration = async (req, res) => {
  try {
    const expirations = await Applicant.find(
      { firstAidExpiration: { $exists: true, $ne: null } },
      { firstAidExpiration: 1, email: 1, _id: 0 }
    );

    if (expirations.length === 0) {
      return res.status(404).json({
        message: "No applicants with First Aid Expiration dates found"
      });
    }

    res.json(expirations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update interview date 
// @route   PUT /api/applicants/saveInterviewDate/applicant/:applicantId
// @access  Private
exports.saveInterviewDate = async (req, res) => {
  try {
    const { applicantId } = req.params;
    const { faceToFaceInterviewDate } = req.body;

    if (!applicantId || !faceToFaceInterviewDate) {
      return res.status(400).json({ error: 'applicantId and faceToFaceInterviewDate are required' });
    }

    const applicant = await ApplicantModel.findByIdAndUpdate(applicantId, { faceToFaceInterviewDate }, { new: true });

    if (!applicant) {
      return res.status(404).json({ error: 'Applicant not found' });
    }

    res.status(200).json(applicant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// @desc    Update Induction date 
// @route   PUT /api/applicants/saveInductionDate/applicant/:applicantId
// @access  Private
exports.saveInductionDate = async (req, res) => {
  try {
    const { applicantId } = req.params;
    const { inductionDate } = req.body;

    if (!applicantId || !inductionDate) {
      return res.status(400).json({ error: 'applicantId and inductionDate are required' });
    }

    console.log(inductionDate)
    console.log(applicantId)
    console.log("Controller Log")
    const applicant = await ApplicantModel.findByIdAndUpdate(applicantId, { inductionDate }, { new: true });

    if (!applicant) {
      return res.status(404).json({ error: 'Applicant not found' });
    }

    res.status(200).json(applicant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @desc    Upload Referees 
// @route   POST /api/applicants/saveReferees/applicant/:applicantId
// @access  Private
exports.saveReferees = async (req, res) => {
  console.log("Entered saveReferees");
    try {
        const { applicantId } = req.params;
        const { selectedReferees } = req.body;

        // Validate required fields
        if (!applicantId || !selectedReferees) {
            return res.status(400).json({ error: 'Both applicantId and selectedReferees are required' });
        }

        // Update the applicant with the referees' data
        const applicant = await ApplicantModel.findByIdAndUpdate(applicantId, { referees: selectedReferees }, { new: true });

        // Check if the applicant exists
        if (!applicant) {
            return res.status(404).json({ error: 'Applicant not found' });
        }

        res.status(200).json(applicant);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


