import { useEffect, useState } from "react";
import axios from "axios";

import "../styles/history.css";

function History() {

  const [history, setHistory] = useState([]);

  // Continue panel state (per waste item + per chat question)
  const [continuePanel, setContinuePanel] = useState(null);
  // shape: { wasteId, chatIdx }

  const [continueQuestion, setContinueQuestion] = useState("");
  const [continueLoading, setContinueLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/waste/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHistory(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenContinue = ({ wasteId, chatIdx }) => {
    setContinuePanel({ wasteId, chatIdx });
    setContinueQuestion("");
  };

  const handleCloseContinue = () => {
    setContinuePanel(null);
    setContinueQuestion("");
    setContinueLoading(false);
  };

  const handleAskContinue = async (wasteId) => {
    if (!continueQuestion.trim()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized: please login again");
        return;
      }

      setContinueLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/waste/chat`,
        {
          wasteId,
          question: continueQuestion,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const answer = response.data.answer;

      // Update UI immediately by appending to correct waste record.
      setHistory((prev) =>
        prev.map((item) => {
          if (item._id !== wasteId) return item;
          return {
            ...item,
            chatHistory: Array.isArray(item.chatHistory)
              ? [...item.chatHistory, { question: continueQuestion, answer }]
              : [{ question: continueQuestion, answer }],
          };
        })
      );

      setContinueQuestion("");
      setContinueLoading(false);
    } catch (error) {
      console.log(error);
      setContinueLoading(false);
      alert("Chat failed");
    }
  };

return (
  <div className="history-page">

    <div className="history-header">
      <h1 className="history-title">
        Upload History
      </h1>

      <p className="history-subtitle">
        View your past waste analyses and continue the AI chat anytime.
      </p>
    </div>

    {history.map((item) => (

      <div
        key={item._id}
        className="history-item"
      >

        <img
          src={
            item.imageUrl?.startsWith("http")
              ? item.imageUrl
              : `${import.meta.env.VITE_API_URL}/uploads/${item.imageUrl}`
          }
          alt="waste"
        />

        <div className="history-ai">
          <pre>{item.aiResult}</pre>
        </div>

        {Array.isArray(item.chatHistory) &&
          item.chatHistory.length > 0 && (

            <div>

              <h3>
                Chat History
              </h3>

              {item.chatHistory.map((chat, idx) => (

                <div
                  key={idx}
                  className="chat-card"
                >

                  <div className="chat-q">
                    <strong>Q:</strong> {chat.question}
                  </div>

                  <div className="chat-a">
                    <strong>A:</strong>
                    <div>
                      {chat.answer}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="continue-btn"
                    onClick={() =>
                      handleOpenContinue({
                        wasteId: item._id,
                        chatIdx: idx,
                      })
                    }
                  >
                    Continue
                  </button>

                  {continuePanel &&
                    continuePanel.wasteId === item._id &&
                    continuePanel.chatIdx === idx && (

                      <div className="continue-panel">

                        <h4>
                          Ask Something More
                        </h4>

                        <textarea
                          className="continue-textarea"
                          value={continueQuestion}
                          onChange={(e) =>
                            setContinueQuestion(
                              e.target.value
                            )
                          }
                          placeholder="Type your follow-up..."
                          rows={3}
                        />

                        <div className="panel-actions">

                          <button
                            type="button"
                            className="ask-btn"
                            disabled={continueLoading}
                            onClick={() =>
                              handleAskContinue(
                                item._id
                              )
                            }
                          >
                            {continueLoading
                              ? "Asking..."
                              : "Give Answer"}
                          </button>

                          <button
                            type="button"
                            className="close-btn"
                            onClick={
                              handleCloseContinue
                            }
                          >
                            Close
                          </button>

                        </div>

                      </div>

                    )}

                </div>

              ))}

            </div>

          )}

      </div>

    ))}

  </div>
);
}

export default History;

