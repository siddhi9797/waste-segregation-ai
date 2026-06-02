const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const wasteRoutes = require("./routes/wasteRoutes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// serve uploaded files
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/waste", wasteRoutes);

app.get("/", (req, res) => {
  res.send("Waste Segregation AI Backend Running");
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
    process.exit(1);
  });

