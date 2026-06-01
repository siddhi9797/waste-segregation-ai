import { useEffect, useState } from "react";
import axios from "axios";

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
    <div style={{ padding: "40px" }}>
      <h1>Upload History</h1>

      {history.map((item) => (
        <div
          key={item._id}
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "10px",
          }}
        >
          <img
            src={`${import.meta.env.VITE_API_URL}/${item.imageUrl}`}
            alt="waste"
            width="200"
          />

          <pre>{item.aiResult}</pre>

          {Array.isArray(item.chatHistory) && item.chatHistory.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <h3>Chat History</h3>

              {item.chatHistory.map((chat, idx) => (
                <div
                  key={idx}
                  style={{
                    marginTop: 12,
                    padding: 12,
                    border: "1px solid #eee",
                    borderRadius: 10,
                  }}
                >
                  <strong>Q:</strong> {chat.question}

                  <div style={{ marginTop: 8 }}>
                    <strong>A:</strong>
                    <div>{chat.answer}</div>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenContinue({
                          wasteId: item._id,
                          chatIdx: idx,
                        })
                      }
                      style={{
                        cursor: "pointer",
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: "1px solid #ccc",
                        background: "#fff",
                      }}
                    >
                      Continue
                    </button>
                  </div>

                  {continuePanel &&
                    continuePanel.wasteId === item._id &&
                    continuePanel.chatIdx === idx && (
                      <div style={{ marginTop: 12 }}>
                        <h4 style={{ margin: "8px 0" }}>Ask AI</h4>

                        <textarea
                          value={continueQuestion}
                          onChange={(e) => setContinueQuestion(e.target.value)}
                          placeholder="Type your follow-up..."
                          rows={3}
                          style={{
                            width: "100%",
                            padding: 12,
                            borderRadius: 10,
                            border: "1px solid #ddd",
                            resize: "vertical",
                          }}
                        />

                        <div
                          style={{
                            marginTop: 10,
                            display: "flex",
                            gap: 10,
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            type="button"
                            disabled={continueLoading}
                            onClick={() => handleAskContinue(item._id)}
                            style={{
                              cursor: continueLoading ? "not-allowed" : "pointer",
                              padding: "10px 14px",
                              borderRadius: 10,
                              border: "1px solid #ccc",
                              background: "#111827",
                              color: "white",
                            }}
                          >
                            {continueLoading ? "Asking..." : "Ask AI"}
                          </button>

                          <button
                            type="button"
                            onClick={handleCloseContinue}
                            style={{
                              cursor: "pointer",
                              padding: "10px 14px",
                              borderRadius: 10,
                              border: "1px solid #ccc",
                              background: "#fff",
                            }}
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

