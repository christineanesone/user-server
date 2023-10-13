const bcrypt = require("bcryptjs");
const User = require("../../../models/UserModel");
const ErrorResponse = require("../../../utils/errorResponse");

// @desc    Update admin profile details 
// @route   PUT api/users/admin/updateProfile
// @access  Private
exports.updateAdminProfile = async (req, res, next) => {
  try {
    // Query user excluding the password field (so validation rules don't set off)
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Update user fields (firstName, lastName, email, cellphone)
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.cellphone = req.body.cellphone || user.cellphone;

    // Check if a new password is provided and update it
    if (req.body.password) {
      user.password = req.body.password;
    }

    // Save the updated user
    const updatedUser = await user.save();

    // Send a response with both success message and updated user data
    res.status(200).json({
      message: "User profile updated successfully",
      user: {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        cellphone: updatedUser.cellphone
      }
    });
  } catch (error) {
    // Handle errors
    next(new ErrorResponse("Error updating profile: " + error.message, 500));
  }
};
