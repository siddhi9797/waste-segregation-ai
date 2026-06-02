const express = require("express");

const router = express.Router();

const {
  getCampaigns,
} = require(
  "../controllers/campaignController"
);

router.get("/", getCampaigns);

module.exports = router;