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

  const [question, setQuestion] =
    useState("");

  const [chatResponse, setChatResponse] =
    useState("");

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

    const formData = new FormData();

    formData.append(
      "image",
      selectedFile
    );

    try {

      const token =
        localStorage.getItem("token");

      const response = await axios.post(

         `${import.meta.env.VITE_API_URL}/api/waste/upload`,
        formData,

        {
          headers: {
            Authorization: token,
          },
        }

      );

      setMessage(
        response.data.message
      );

      setAiResult(
        response.data.data.aiResult
      );

    }

    catch (error) {

      console.log(error);

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

      const response =
        await axios.post(

           `${import.meta.env.VITE_API_URL}/api/waste/upload`,

          {

            wasteInfo: aiResult,

            question,

          },

          {

            headers: {
              Authorization: token,
            },

          }

        );

      setChatResponse(
        response.data.answer
      );

    }

    catch (error) {

      console.log(error);

      alert("Chat failed");

    }

  };

  return (

    <div className="upload-page">

      <div className="upload-container">

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

              {

                chatResponse && (

                  <pre
                    style={{
                      marginTop: "15px",
                    }}
                  >
                    {chatResponse}
                  </pre>

                )

              }

            </div>

          )

        }

      </div>

    </div>

  );

}

export default Upload;