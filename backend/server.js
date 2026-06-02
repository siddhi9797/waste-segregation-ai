const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// Routes
app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

app.use(
  "/api/waste",
  require("./routes/wasteRoutes")
);

app.use(
  "/api/campaigns",
  require("./routes/campaignRoutes")
);

// Test route
app.get("/", (req, res) => {
  res.send("Waste Management API Running");
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {

    console.log("MongoDB Connected");

    app.listen(
      process.env.PORT || 5000,
      () => {

        console.log(
          `Server running on port ${
            process.env.PORT || 5000
          }`
        );

      }
    );

  })
  .catch((err) => {

    console.log(
      "MongoDB Error:",
      err
    );

  });