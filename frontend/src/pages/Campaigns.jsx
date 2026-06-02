import { useEffect, useState } from "react";
import axios from "axios";

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
    return <h2>Loading Campaigns...</h2>;
  }

  return (
    <div className="campaigns-container">
      <h1>Live Waste Campaigns</h1>

      {campaigns.length === 0 ? (
        <p>No campaigns found.</p>
      ) : (
        campaigns.map((campaign, index) => (
          <div className="campaign-card" key={index}>
            <h2>{campaign.title}</h2>

            <p>{campaign.description}</p>

            <small>
              {campaign.pubDate &&
                new Date(campaign.pubDate).toLocaleDateString()}
            </small>

            <br />

            <a
              href={campaign.link}
              target="_blank"
              rel="noreferrer"
            >
              Read More
            </a>
          </div>
        ))
      )}
    </div>
  );
}

export default Campaigns;