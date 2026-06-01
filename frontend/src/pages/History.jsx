import { useEffect, useState } from "react";
import axios from "axios";

function History() {

  const [history, setHistory] =
    useState([]);

  useEffect(() => {

    fetchHistory();

  }, []);

  const fetchHistory = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response =
        await axios.get(
          `${import.meta.env.VITE_API_URL}/api/waste/history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      setHistory(
        response.data
      );

    }

    catch (error) {

      console.log(error);

    }

  };

  return (

    <div
      style={{
        padding: "40px",
      }}
    >

      <h1>
        Upload History
      </h1>

      {

        history.map((item) => (

          <div

            key={item._id}

            style={{

              border:
                "1px solid #ddd",

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

            <pre>

              {item.aiResult}

            </pre>

            {Array.isArray(item.chatHistory) && item.chatHistory.length > 0 && (

              <div style={{ marginTop: 16 }}>

                <h3>Chat History</h3>

                {item.chatHistory.map((chat, idx) => (

                  <div key={idx} style={{ marginTop: 12, padding: 12, border: '1px solid #eee', borderRadius: 10 }}>

                    <strong>Q:</strong> {chat.question}

                    <div style={{ marginTop: 8 }}>

                      <strong>A:</strong>

                      <div>{chat.answer}</div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        ))

      }

    </div>

  );

}

export default History;