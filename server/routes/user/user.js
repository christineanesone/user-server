const express = require("express");
const router = express.Router();
const {
  signUp,
  signIn,
  signOut,
  getAllEmployees,
  getEmployeeDetails,
  updatePoliceExpiry,
  getUserInfo,
  uploadController,
  updateApplicantAttribute,
  updateEmployeeBlurb,
  getPdf,
  editNotes,
} = require("../../controllers/user/user");
const { updateAdminProfile } = require("../../controllers/admin/admin/admin");
const {
  uploadImage,
  updateUserProfile,
} = require("../../controllers/profile/profile");
const authMiddleware = require("../../middleware/auth");
const UserModel = require("../../models/UserModel");
const ApplicantModel = require("../../models/ApplicantModel");

//Routes

router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.post("/signOut", signOut);

//Employees
router.get("/info", authMiddleware, getUserInfo);
router.put("/updateProfile", authMiddleware, updateUserProfile);
router.get("/employees", authMiddleware, getAllEmployees);
router.put(
  "/employeesDetails/employee/:employeeId/employeeBlurb",
  authMiddleware, updateEmployeeBlurb
);
router.put(
  "/employeesDetails/employee/:employeeId/policeExpiryDate",
  authMiddleware, updatePoliceExpiry
);
router.get("/employeesDetails/employee/:employeeId", authMiddleware, getEmployeeDetails);
router.put("/updateStatus/:applicantId", authMiddleware, updateApplicantAttribute);

//Admin routes
router.put("/admin/updateProfile", authMiddleware, updateAdminProfile);

//PDF and Images
router.post("/uploadFile/:applicantId", authMiddleware, uploadController);
router.get("/getPdf/:applicantId", getPdf);
router.post("/image/upload", uploadImage);

//Editing Notes
router.put("/editNotes/:applicantId", editNotes);

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(updatedEmployee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
