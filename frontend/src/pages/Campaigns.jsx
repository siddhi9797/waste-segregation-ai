import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/campaigns.css";

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
        Loading Campaigns...
      </div>
    );
  }

  return (
    <div className="campaigns-page">

      <div className="campaigns-hero">
        <h1>🌍 Live Waste Campaigns</h1>

        <p>
          Stay updated with environmental initiatives,
          recycling drives, sustainability campaigns,
          and waste management awareness programs.
        </p>
      </div>

      <div className="campaigns-grid">

        {campaigns.map((campaign, index) => (

          <div
            className="campaign-card"
            key={index}
          >

            <div className="campaign-date">
              {campaign.pubDate &&
                new Date(
                  campaign.pubDate
                ).toLocaleDateString()}
            </div>

            <h2>
              {campaign.title}
            </h2>

            <p>
              {campaign.description}
            </p>

            <a
              href={campaign.link}
              target="_blank"
              rel="noreferrer"
              className="campaign-btn"
            >
              Learn More →
            </a>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Campaigns;