const Waste = require("../models/Waste");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const uploadWaste = async (req, res) => {
  try {
    const imagePath = req.file.path;

    const imageBase64 = fs.readFileSync(imagePath, {
      encoding: "base64",
    });

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.2-11b-vision-instruct",
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

IMPORTANT RULES:

1. First determine whether the image contains waste/trash/garbage/recyclable material.

2. If the image does NOT contain any waste item, reply EXACTLY:

This is not a waste image.

Do not provide any additional explanation.

3. If the image DOES contain waste, reply ONLY in the following format:

Waste Type: <type>

Recyclable or Non-Recyclable: <value>

Disposal Method: <method>

Environmental Impact: <impact>

Examples:

Waste Type: Plastic Bottle

Recyclable or Non-Recyclable: Recyclable

Disposal Method: Place in plastic recycling bin

Environmental Impact: Can be recycled into new plastic products and reduces landfill waste

Be concise and accurate.
`,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
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
      }
    );

    const aiText = response.data.choices[0].message.content;

    const waste = await Waste.create({
      userId: req.user.id,
      // Store only filename (matches /uploads static hosting)
      imageUrl: req.file.filename,
      aiResult: aiText,
    });

    res.status(200).json({
      success: true,
      message: "Waste analyzed successfully",
      data: waste,
    });
  } catch (error) {
    console.log(error.response?.data || error);
    res.status(500).json({
      error: "AI analysis failed",
    });
  }
};

const chatWithWaste = async (req, res) => {
  try {
    const { wasteId, question } = req.body;

    const waste = await Waste.findById(wasteId);

    if (!waste) {
      return res.status(404).json({
        message: "Waste record not found",
      });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.2-11b-vision-instruct",
        max_tokens: 300,
        messages: [
          {
            role: "system",
            content: `
You are a waste management expert.

Original Analysis:

${waste.aiResult}

Answer user questions based on this waste analysis.
`,
          },
          {
            role: "user",
            content: question,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const answer = response.data.choices[0].message.content;

    waste.chatHistory.push({
      question,
      answer,
    });

    await waste.save();

    res.status(200).json({
      answer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Chat failed",
    });
  }
};

const getHistory = async (req, res) => {
  try {
    const history = await Waste.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    // Normalize imageUrl so both old and new DB records work:
    // - if DB stores `uploads/<file>` or a path, strip to basename
    // - if DB stores just `<file>`, keep as-is
    const normalizedHistory = history.map((item) => {
      const obj = item.toObject();

      if (obj.imageUrl) {
        obj.imageUrl = path.basename(String(obj.imageUrl).replace(/\\/g, "/"));
      }

      return obj;
    });

    res.status(200).json(normalizedHistory);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  uploadWaste,
  getHistory,
  chatWithWaste,
};

