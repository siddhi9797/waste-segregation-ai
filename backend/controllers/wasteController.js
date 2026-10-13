
const Waste = require("../models/Waste");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const uploadWaste = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "Please upload a waste image",
      });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({
        error: "AI API key is not configured on the server",
      });
    }

    const imagePath = req.file.path;

    const imageBase64 = fs.readFileSync(imagePath, {
      encoding: "base64",
    });

    const mimeType = req.file.mimetype || "image/jpeg";

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openrouter/free",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `
You are a waste segregation expert.

Analyze the uploaded image carefully.

1. Determine whether the image contains waste, trash,
garbage, or recyclable material.

2. If the image does NOT contain waste, reply EXACTLY:

This is not a waste image.

Do not provide any additional explanation.

3. If the image DOES contain waste, reply ONLY in this format:

Waste Type: <type>

Recyclable or Non-Recyclable: <value>

Disposal Method: <method>

Environmental Impact: <impact>

Be concise and accurate. Do not invent details that
cannot be determined from the image.
`,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 60000,
      }
    );

    const aiText = response.data?.choices?.[0]?.message?.content;

    if (!aiText) {
      throw new Error("AI returned an empty response");
    }

    const waste = await Waste.create({
      userId: req.user.id,
      imageUrl: req.file.filename,
      aiResult: aiText,
    });

    return res.status(200).json({
      success: true,
      message: "Waste analyzed successfully",
      data: waste,
    });
  } catch (error) {
    console.error(
      "Waste analysis failed:",
      error.response?.status,
      error.response?.data || error.message
    );

    return res.status(500).json({
      error: "AI analysis failed",
    });
  }
};

const chatWithWaste = async (req, res) => {
  try {
    const { wasteId, question } = req.body;

    if (!wasteId || !question || !String(question).trim()) {
      return res.status(400).json({
        message: "Waste ID and question are required",
      });
    }

    const waste = await Waste.findOne({
      _id: wasteId,
      userId: req.user.id,
    });

    if (!waste) {
      return res.status(404).json({
        message: "Waste record not found",
      });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openrouter/free",
        max_tokens: 300,
        messages: [
          {
            role: "system",
            content: `
You are a waste management expert.

Original Analysis:
${waste.aiResult}

Answer user questions based on this waste analysis.
Be concise, helpful, and accurate.
`,
          },
          {
            role: "user",
            content: String(question).trim(),
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 60000,
      }
    );

    const answer = response.data?.choices?.[0]?.message?.content;

    if (!answer) {
      throw new Error("AI returned an empty response");
    }

    waste.chatHistory.push({
      question: String(question).trim(),
      answer,
    });

    await waste.save();

    return res.status(200).json({
      answer,
    });
  } catch (error) {
    console.error(
      "Waste chat failed:",
      error.response?.status,
      error.response?.data || error.message
    );

    return res.status(500).json({
      message: "Chat failed",
    });
  }
};

const getHistory = async (req, res) => {
  try {
    const history = await Waste.find({
      userId: req.user.id,
    }).sort({
      createdAt: -1,
    });

    const normalizedHistory = history.map((item) => {
      const obj = item.toObject();

      if (obj.imageUrl) {
        obj.imageUrl = path.basename(
          String(obj.imageUrl).replace(/\\/g, "/")
        );
      }

      return obj;
    });

    return res.status(200).json(normalizedHistory);
  } catch (error) {
    console.error("History retrieval failed:", error.message);

    return res.status(500).json({
      message: "Failed to retrieve waste history",
    });
  }
};

module.exports = {
  uploadWaste,
  getHistory,
  chatWithWaste,
};
