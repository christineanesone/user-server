const jwt = require("jsonwebtoken");
const User = require("../../models/UserModel");
const Applicant = require("../../models/ApplicantModel");
const ErrorResponse = require("../../utils/errorResponse");

const generateToken = async (user, statusCode, res) => {
  const token = await user.jwtGenerateToken();
  const options = {
    httpOnly: true,
    expires: new Date(Date.now() + process.env.EXPIRE_TOKEN) // Expire token = 1hr
  };

  // Create the token with the payload containing only the user's id
  const signedToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h"
  });

  // Set the token as a cookie
  res
    .status(statusCode)
    .cookie("token", signedToken, options)
    .json({ success: true, token: signedToken });
};

// @desc    Register new user
// @route   POST /api/users/signUp
// @access  Public
exports.signUp = async (req, res, next) => {
  const { email } = req.body;

  // Check if a user with the same email exists
  const userExists = await User.findOne({ email });

  // Email needs to be unique
  if (userExists) {
    return next(
      new ErrorResponse(
        "An account has already been registered with that email",
        400
      )
    );
  }
  try {
    // Find existing applicant using email address
    const existingApplicant = await Applicant.findOne({
      email: req.body.email,
    });

    if (!existingApplicant) {
      return next(
        new ErrorResponse("No application found for this email address", 404)
      );
    }

    // create and link user to their applicantId
    const userData = {
      applicantId: existingApplicant._id, //existing applicant
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password
    };

    const user = await User.create(userData);

    res.status(201).json({
      success: true,
      user
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// @desc    Authenticate user
// @route   POST /api/users/signIn
// @access  Public
exports.signIn = async (req, res, next) => {
  let token;

  try {
    const { email, password } = req.body;

    // Check if user hasn't entered an email/password
    if (!email || !password) {
      return next(
        new ErrorResponse(
          "Please enter your Email and Password to sign in",
          400
        )
      );
    }

    // Check email
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse("Invalid Email address", 400));
    }

    // Verify user password
    if (!user || !(await user.comparePassword(password))) {
      return next(new ErrorResponse("Invalid password", 401));
    }

    // Determine if the user is an admin
    const isAdmin = user.isAdmin;

    // Generate token with only the user's id
    token = await user.jwtGenerateToken(); // Assign the token here

    // Set the token as a cookie and send it in the response
    const options = {
      httpOnly: true,
      expires: new Date(Date.now() + Number(process.env.EXPIRE_TOKEN)) // Expire token = 1hr
    };

    // Set the token as a cookie
    res.status(200).cookie("token", token, options).json({
      success: true,
      isAdmin: user.isAdmin,
      token,
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      cellphone: user.cellphone
    });

    console.log("User is admin:", isAdmin);
  } catch (error) {
    console.log(error);
    next(
      new ErrorResponse("Cannot log in, please check your credentials", 400)
    );
  }
};

// @desc    Get user info
// @route   GET /api/users/info
// @access  Private
exports.getUserInfo = async (req, res) => {
  console.log("users", req.body);
  try {
    // Fetch user information based on the user ID from the request object
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the user information
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Sign out user
// @route   POST /api/users/signOut
// @access  Private
exports.signOut = (res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Sign out successful"
  });
};

// @desc    Get all employees
// @route   GET /api/users/employees
// @access  Private
exports.getAllEmployees = async (req, res) => {
  try {
    const allApplicants = await Applicant.find({});

    const employees = allApplicants.filter(
      (applicant) => applicant.role === "Employee"
    );

    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get employee details
// @route   GET /api/users/employeesDetails/employee/:employeeId
// @access  Private
exports.getEmployeeDetails = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employee = await Applicant.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update applicant status
// @route   PUT /api/users/updateStatus/:applicantId
// @access  Private
exports.updateApplicantAttribute = async (req, res) => {
  const applicantId = req.params.applicantId;
  const { attribute, updatedStatus } = req.body;

  console.log("Controller Reached");
  console.log(attribute);

  const update = {};
  update[attribute] = updatedStatus;
  console.log("Update Object:", update);

  try {
    const updatedApplicant = await Applicant.findByIdAndUpdate(
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

// @desc    Update police expiry details 
// @route   POST /api/users/employeesDetails/employee/:employeeId/policeExpiryDate
// @access  Private
exports.updatePoliceExpiry = async (req, res, next) => {
  const { employeeId } = req.params;
  const { policeExpiryDate } = req.body;

  try {
    await Applicant.updateOne(
      { _id: employeeId },
      { policeExpiryDate: policeExpiryDate }
    );

    res
      .status(200)
      .json({ message: "Successfully updated police expiry date" });
  } catch (error) {
    console.error("Error updating police expiry date:", error);
    next(new ErrorResponse("Error updating police expiry date", 500));
  }
};

// @desc    Update employee blurb
// @route   PUT /api/users/updateBlurb/:employeeId
// @access  Private
exports.updateEmployeeBlurb = async (req, res, next) => {
  const { employeeId } = req.params;
  const { employeeBlurb } = req.body;

  try {
    await Applicant.updateOne({ _id: employeeId }, { employeeBlurb: employeeBlurb });

    res.status(200).json({ message: "Successfully updated employee blurb" });
  } catch (error) {
    console.error("Error updating employee blurb:", error);
    next(new ErrorResponse("Error updating employee blurb", 500));
  }
};


// @desc    Upload pdf
// @route   POST /api/users/uploadFile/:applicantId
// @access  Private
exports.uploadController = async (req, res) => {
  console.log("Controller Reached");

  try {
    if (!req.file) {
      console.log("!req.file");
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { applicantId } = req.params;
    console.log("req params:", req.params);
    const applicant = await Applicant.findById(applicantId);
    console.log("Applicant", await Applicant.findById(applicantId));
    const attribute = req.query.attribute;
    console.log("attribute",req.query.attribute);

    console.log(attribute);

    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    const pdfBuffer = req.file.buffer;

    applicant[attribute] = {
      fileName: req.file.originalname,
      data: pdfBuffer // Option to store PDF data as a 64 bit string. Option to store it as a buffer.
    };

    await applicant.save();

    res.status(201).json({
      message: "PDF uploaded and attached to the applicant successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// @desc    Get pdfs for rendering   
// @route   POST /api/users/getPdf/:applicantId
// @access  Private
exports.getPdf = async (req, res) => {
  console.log("Get PDF controller reached");

  const { applicantId } = req.params;
  const attribute = req.query.attribute;
  console.log(applicantId);
  console.log(attribute);

  try {
    const applicant = await Applicant.findById(applicantId);

    if (!applicant || !applicant[attribute]) {
      return res.status(404).json({ message: "PDF not found" });
    }

    const pdfBuffer = applicant[attribute].data;
    const fileName = applicant[attribute].fileName; // Get the file name from the database

    // Check if the pdfBase64 variable is undefined
    if (!pdfBuffer) {
      return res.status(404).json({ message: "PDF data is undefined" });
    }

    // Send both the PDF data and file name in the response
    res.status(200).json({ pdfBuffer, fileName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// @desc    Edit notes controller
// @route   PUT /api/users/editNotes/:applicantId
// @access  Private
exports.editNotes = async (req, res, next) => {
  const { applicantId } = req.params;
  const { newNotes } = req.body;

  try {
    await Applicant.updateOne({ _id: applicantId }, { notes: newNotes });

    res.status(200).json({ message: "Successfully updated notes" });
  } catch (error) {
    console.error("Error updating notes:", error);
    next(new ErrorResponse("Error updating notes", 500));
  }
};
