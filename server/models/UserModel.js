//getting mongoose
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const UserSchema = new mongoose.Schema(
  {
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "applicant" // Refers to the 'applicant' collection
    },

    firstName: {
      type: String,
      trim: true,
      required: [true, "enter your first name"]
    },

    lastName: {
      type: String,
      trim: true,
      required: [true, "enter your last name"]
    },

    email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "enter a valid email address"],
      match: [
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        "enter in a valid email address"
      ]
    },

    cellphone: {
      type: String,
      trim: true
    },

    password: {
      type: String,
      required: [true, "enter a password"],
      minlength: [6, "Password must contain at least six(6) letters"],
      maxlength: [
        100,
        "Password must not be longer than one hundred(100) characters"
      ],
      match: [
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,100}$/,
        "Password must be between 6 to 100 characters, with at least one numeric digit, one uppercase letter, and one lowercase letter"
      ]
    },

    // diffrenciating active users and inactive (deleted) users
    role: {
      type: String,
      enum: ["applicant", "employee", "inactive"],
      default: "applicant"
    },

    isAdmin: {
      type: Boolean,
      default: false
    },

    //PDF handler
    pdfPath: {
      type: String,
      default: ""
    },

    profileImage: {
      public_id: {
        type: String, 
      },
      url: {
        type: String, 
      }
      
    },
  },
  { timestamps: true }
);

// Verifying password, including the updated password
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Get the token
UserSchema.methods.jwtGenerateToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: 3600
  });
};

//Encrypting password before saving to database
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, saltRounds);
});

//"users" = mongodbCollection
const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
