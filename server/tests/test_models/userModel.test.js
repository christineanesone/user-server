const chai = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");
const UserModel = require("../../models/UserModel");
require("dotenv").config();

const { expect } = chai;
const uniqueEmail = `testuser${Math.random()}@example.com`;

describe("User Model", () => {
  console.log("Database URI:", process.env.DATABASE_TEST);

  before(async () => {
    // Connect to the testing database before all tests
    await mongoose.connect(process.env.DATABASE_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  beforeEach(async () => {
    // Clear the users collection in the test database before each test
    await UserModel.deleteMany({});
  });

  after(async () => {
    // Disconnect from the testing database after all tests and drop the database
    try {
      await mongoose.connection.dropDatabase();
    } catch (error) {
      console.error("Error dropping test database:", error);
    } finally {
      await mongoose.connection.close();
    }
  });

  describe("comparePassword method", () => {
    it("should return true if the entered password matches the stored password", async () => {
      const user = new UserModel({
        firstName: "John",
        lastName: "Doe",
        email: uniqueEmail,
        password: "Password123"
      });
      await user.save();

      const result = await user.comparePassword("Password123");
      expect(result).to.be.true;
    });

    it("should return false if the entered password does not match the stored password", async () => {
      const user = new UserModel({
        firstName: "Jane",
        lastName: "Doe",
        email: uniqueEmail,
        password: "Password123"
      });
      await user.save();

      const result = await user.comparePassword("WrongPassword");
      expect(result).to.be.false;
    });
  });

  describe("Schema Validation", () => {
    it("should not save user without required fields", async () => {
      const user = new UserModel();
      try {
        await user.save();
        throw new Error("User should not save without required fields");
      } catch (error) {
        expect(error).to.exist;
        expect(error.errors).to.have.property("firstName");
        expect(error.errors).to.have.property("lastName");
        expect(error.errors).to.have.property("email");
        expect(error.errors).to.have.property("password");
      }
    });
  });

  it("should not save user with invalid password format", async () => {
    const user = new UserModel({
      firstName: "John",
      lastName: "Doe",
      email: uniqueEmail,
      password: "weakpassword" // Password doesn't meet criteria
    });
    try {
      await user.save();
      throw new Error("User should not save with invalid password format");
    } catch (error) {
      expect(error).to.exist;
      // Check if the error message contains the specific validation error for password
      expect(error.errors).to.have.property("password");
      // Check if the error message includes the correct error message for invalid password format
      expect(error.errors.password.message).to.include(
        "Password must be between 6 to 100 characters"
      );
      expect(error.errors.password.message).to.include(
        "at least one numeric digit"
      );
    }
  });

  it("should save user with valid data including a strong password", async () => {
    const user = new UserModel({
      firstName: "John",
      lastName: "Doe",
      email: uniqueEmail,
      password: "StrongPassword123"
    });

    try {
      const savedUser = await user.save();

      // Check existence of required fields
      expect(savedUser.firstName).to.equal("John");
      expect(savedUser.lastName).to.equal("Doe");
      expect(savedUser.email).to.equal(uniqueEmail);

      // Check valid email format
      const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      expect(savedUser.email).to.match(emailRegex);

      // Check password strength (assuming your password validation logic is applied in the schema)
      // Check minimum and maximum password length
      expect(savedUser.password.length).to.be.at.least(6);
      expect(savedUser.password.length).to.be.at.most(100);

      // Check pattern matching (at least one digit, one uppercase letter, and one lowercase letter)
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,100}$/;
      expect(savedUser.password).to.match(passwordRegex);

      // Check default values
      expect(savedUser.role).to.equal("applicant");
      expect(savedUser.isAdmin).to.equal(false);
      expect(savedUser.policeExpiryDate).to.equal("N/A");
      expect(savedUser.employeeBlurb).to.equal("N/A");
      expect(savedUser.pdfPath).to.equal("");
      expect(savedUser.myFile).to.equal("");

      // Check timestamps
      expect(savedUser.createdAt).to.exist;
      expect(savedUser.updatedAt).to.exist;
    } catch (error) {
      throw new Error(
        "User should save with valid data including a strong password"
      );
    }
  });
});
