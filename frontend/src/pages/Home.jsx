import "../styles/home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="hero-section">
        <h1>
          AI Powered Waste Detection & Recycling Platform
        </h1>

        <p>
          Upload waste images and let AI identify recyclable materials,
          environmental impact, disposal methods, and smart recycling insights
          in seconds.
        </p>

        <button
          type="button"
          onClick={() => navigate("/upload")}
        >
          Start Scanning
        </button>
      </div>
    </div>
  );
}

export default Home;