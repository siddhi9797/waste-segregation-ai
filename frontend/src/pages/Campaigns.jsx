import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/compaign.css";

function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get(
        "https://waste-segregation-ai-w6he.onrender.com/api/campaigns"
      );

      setCampaigns(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="campaign-loading">
        <div className="loader"></div>
        <h2>Loading Campaigns...</h2>
      </div>
    );
  }

  return (
    <div className="campaigns-page">

      <div className="campaigns-hero">

        <span className="hero-badge">
          ♻ Environmental Awareness
        </span>

        <h1>Live Waste Campaigns</h1>

        <p>
          Discover environmental initiatives,
          recycling programs, cleanup drives,
          and sustainability campaigns happening
          around the world.
        </p>

      </div>

      <div className="campaigns-grid">

        {campaigns.map((campaign, index) => (

          <div
            className="campaign-card"
            key={index}
          >

            <div className="campaign-card-top">

              <div className="campaign-date">
                📅{" "}
                {campaign.pubDate &&
                  new Date(
                    campaign.pubDate
                  ).toLocaleDateString()}
              </div>

              <div className="campaign-tag">
                🌱 Environment
              </div>

            </div>

            <h2>
              {campaign.title}
            </h2>

            <p>
              {campaign.description}
            </p>

            <div className="campaign-footer">

              <a
                href={campaign.link}
                target="_blank"
                rel="noreferrer"
                className="campaign-btn"
              >
                Read More →
              </a>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Campaigns;