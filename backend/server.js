const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const wasteRoutes = require("./routes/wasteRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads",
  express.static("uploads")
);

app.use("/api/auth", authRoutes);
app.use("/api/waste", wasteRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Connected");
})
.catch((error) => {
  console.log(error);
});

app.get("/", (req, res) => {
  res.send("Waste Segregation AI Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});