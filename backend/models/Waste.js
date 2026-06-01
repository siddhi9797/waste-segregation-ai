const mongoose = require("mongoose");

const wasteSchema = new mongoose.Schema({

  userId: {

    type: mongoose.Schema.Types.ObjectId,

    ref: "User",

    required: true,

  },

  imageUrl: {

    type: String,

    required: true,

  },

  aiResult: {

    type: String,

  },

  chatHistory: [

    {

      question: String,

      answer: String,

    },

  ],

  createdAt: {

    type: Date,

    default: Date.now,

  },

});

module.exports = mongoose.model(
  "Waste",
  wasteSchema
);