import "../styles/home.css";

function Home() {
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
          onClick={() => {
            window.location.href = "/upload";
          }}
        >
          Start Scanning
        </button>
      </div>
    </div>
  );
}

export default Home;

