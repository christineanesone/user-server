const { cloudinary, opts } = require("../../utils/cloudinary");
const User = require("../../models/UserModel");

//Image controller

// @desc    Upload image to Cloudinary
// @route   POST api/users/image/upload
// @access  Private
exports.uploadImage = async (req, res, next) => {
  try {
    const { image, _id } = req.body;
    console.log(image, _id);
    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    if (!image || !_id) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    const result = await cloudinary.uploader.upload(image, opts);

    // Update the user's profileImage field with the Cloudinary image URL
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.profileImage = {
      public_id: result.public_id,
      url: result.secure_url,
    };

    await user.save();

    res.status(200).json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};


// @desc    Update user profile details
// @route   PUT api/users/updateProfile
// @access  Private
exports.updateUserProfile = async (req, res, next) => {
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

