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

          "http://localhost:5000/api/waste/history",

          {
            headers: {
              Authorization: token,
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

              src={`http://localhost:5000/${item.imageUrl}`}

              alt="waste"

              width="200"

            />

            <pre>

              {item.aiResult}

            </pre>

          </div>

        ))

      }

    </div>

  );

}

export default History;