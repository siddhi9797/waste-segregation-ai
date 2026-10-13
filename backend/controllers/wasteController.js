
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
    message: "AI API key is not configured on the server",
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
        max_tokens: 800,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `
You are an expert AI waste identification and waste management assistant.

Analyze the uploaded image carefully and identify the waste item.

Return a detailed analysis using the following exact headings:

1. Waste Type:
Identify the waste item and its material, if possible.

2. Recyclability:
State whether it is Recyclable, Non-Recyclable, or Conditionally Recyclable. Explain why.

3. Biodegradability:
State whether it is Biodegradable, Non-Biodegradable, or Partially Biodegradable. Explain briefly.

4. Disposal Method:
Explain how the user should dispose of this waste safely.

5. Recycling Method:
If recyclable, explain the steps involved in recycling it. If it is not recyclable, explain the best alternative disposal method.

6. Decomposition Method and Time:
Explain how the waste decomposes naturally, if applicable. Provide an approximate decomposition time only when a reliable estimate is available. Clearly mention that the time varies depending on environmental conditions. If it does not naturally decompose within a practical timeframe, explain this.

7. Environmental Impact:
Explain the possible effects on soil, water, air, wildlife, human health, and the environment, as applicable.

8. Recommended Action:
Give the user a simple, practical action to take.

9. Identification Confidence:
State High, Medium, or Low confidence. If the image is unclear, mention the uncertainty instead of guessing.

Important rules:
- Use simple, clear English.
- Give specific information about the item in the image.
- Do not assume that every plastic, paper, or metal item is recyclable; coatings, contamination, and local facilities can affect recyclability.
- Do not confuse recyclability with biodegradability.
- Do not invent facts or exact decomposition times.
- If the image does not clearly show waste, respond: "This image does not clearly show an identifiable waste item. Please upload a clearer image."
- Keep the answer organized, informative, and easy to read.
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
        max_tokens: 800,
        messages: [
        {
  role: "system",
  content: `
You are an expert waste identification and waste management assistant.

Original Waste Analysis:
${waste.aiResult}

Answer the user's question using the original waste analysis.
Explain recyclability and biodegradability separately.
Provide practical disposal, recycling, or decomposition guidance when relevant.
Use simple English and avoid inventing facts.
If the original analysis does not contain enough information, explain the uncertainty.
`
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

const choice = response.data?.choices?.[0];
const message = choice?.message;
let answer = message?.content;

// Some models may return content as an array.
if (Array.isArray(answer)) {
  answer = answer
    .map((item) => item.text || "")
    .filter(Boolean)
    .join("\n");
}

if (typeof answer !== "string" || !answer.trim()) {
  console.error(
    "OpenRouter chat returned no text:",
    JSON.stringify({
      model: response.data?.model,
      finish_reason: choice?.finish_reason,
      message: message,
      usage: response.data?.usage,
    })
  );

  throw new Error("AI returned no usable text");
}

answer = answer.trim();

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
    error.response?.status || "No HTTP status",
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
