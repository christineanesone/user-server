const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const UserModel = require("./models/UserModel");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");
const corsOptions = require("./config/corsOptions");

//IMPORTING ROUTES
const userRoutes = require("./routes/user/user"); 
const applicantRoutes = require("./routes/admin/applicant");

require("dotenv").config();

const app = express();

// Enable CORS for all routes
app.use(cors(corsOptions));

// DATABASE CONNECTION
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection established."))
  .catch((err) => console.log("MongoDB connection failed:", err.message));

//MIDDLEWARE
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(express.json());

// ROUTES MIDDLEWARE
app.use("/api/users", userRoutes);
app.use("/api/applicants", applicantRoutes);

//ERROR HANDLING
app.use(errorHandler);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

//Deploymemt server success message
app.get("/", function (req, res) {

      // Send a JSON response indicating that the server is connected
      res.status(201).json({ message: "Connected to server" });

});
