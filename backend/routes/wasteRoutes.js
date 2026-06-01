const express = require("express");

const router = express.Router();

const upload = require("../middlewares/upload");

const auth = require("../middlewares/authMiddleware");

const {

  uploadWaste,

  getHistory,

  chatWithWaste,

} = require(
  "../controllers/wasteController"
);

router.post(

  "/upload",

  auth,

  upload.single("image"),

  uploadWaste

);

router.get(

  "/history",

  auth,

  getHistory

);

router.post(

  "/chat",

  auth,

  chatWithWaste

);

module.exports = router;