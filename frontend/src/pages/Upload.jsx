import { useState } from "react";
import axios from "axios";

import "../styles/upload.css";

function Upload() {

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [preview, setPreview] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [aiResult, setAiResult] =
    useState("");

  const [wasteId, setWasteId] =
    useState("");

  const [question, setQuestion] =
    useState("");

  const [chatHistory, setChatHistory] =
    useState([]);

  const [chatResponse, setChatResponse] =
    useState("");

  // Used only for rendering the running chat (prevents UI jumping/disappearing).
  const [chatAnswerList, setChatAnswerList] =
    useState([]);

  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (file) {

      setSelectedFile(file);

      setPreview(
        URL.createObjectURL(file)
      );

    }

  };

  const handleUpload = async () => {

    if (!selectedFile) {

      alert("Please select image");

      return;

    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized: please login again");
      return;
    }

    const formData = new FormData();

    formData.append(
      "image",
      selectedFile
    );

    try {

      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/waste/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message
      );

      setAiResult(
        response.data.data.aiResult
      );

      setWasteId(
        response.data.data._id
      );

    }

   catch (error) {

  console.log(
    "UPLOAD ERROR:",
    error.response?.data
  );

  setMessage(

    error.response?.data?.message ||

    error.response?.data?.error ||

    "Upload Failed"

  );

}

  };

  const askQuestion = async () => {

    if (!question) return;

    try {

      const token =
        localStorage.getItem("token");

      if (!aiResult) {
        alert("Upload an image first");
        return;
      }

      // wasteId is returned by upload endpoint; since this component didn't store it,
      // we re-fetch it by asking the backend? Not available.
      // Quick fix: store wasteId on upload.

      if (!wasteId) {
        alert("Please click Analyze Waste first.");
        return;
      }

      const response =
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/waste/chat`,
          {
            wasteId,
            question,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      // Keep chat UI visible for multiple questions.
      // Store latest answer and also append to history.
      setChatResponse(response.data.answer);
      setChatAnswerList((prev) => [...prev, { question, answer: response.data.answer }]);
      setChatHistory((prev) => [
        ...prev,
        { question, answer: response.data.answer },
      ]);

    }

    catch (error) {

      console.log(error);

      alert("Chat failed");

    }

  };

  return (

    <div className="upload-page">

        <div className="upload-container glass">

        <h1>
          Upload Waste Image
        </h1>


        <p>
          Upload waste image for
          AI analysis
        </p>

        <label className="upload-box">

          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />

          {

            preview ? (

              <img
                src={preview}
                alt="preview"
                className="preview-image"
              />

            ) : (

              <div className="upload-content">

                <h2>
                  Click To Upload
                </h2>

                <span>
                  PNG, JPG, JPEG
                </span>

              </div>

            )

          }

        </label>

        <button
          className="upload-btn"
          onClick={handleUpload}
        >
          Analyze Waste
        </button>

        {

          message && (

            <p className="message">
              {message}
            </p>

          )

        }

        {

          aiResult && (

            <div className="ai-result-card">

              <h2>
                AI Analysis Result
              </h2>

              <pre>
                {aiResult}
              </pre>

            </div>

          )

        }

        {

          aiResult && (

            <div
              className="ai-result-card"
              style={{ marginTop: "20px" }}
            >

              <h2>
                Ask AI About This Waste
              </h2>

              <input

                type="text"

                placeholder="Ask anything..."

                value={question}

                onChange={(e) =>
                  setQuestion(
                    e.target.value
                  )
                }

                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "10px",
                }}

              />

              <button
                className="upload-btn"
                onClick={askQuestion}
              >
                Ask AI
              </button>

              {chatAnswerList.length > 0 && (

                <div style={{ marginTop: "15px" }}>

                  {chatAnswerList.map((item, idx) => (

                    <div key={idx} style={{ marginBottom: 14 }}>

                      <div>

                        <strong>Q:</strong> {item.question}

                      </div>

                      <pre style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>

                        {item.answer}

                      </pre>

                    </div>

                  ))}

                </div>

              )}

            </div>

          )

        }

      </div>

    </div>

  );

}

export default Upload;