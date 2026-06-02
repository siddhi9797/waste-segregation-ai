import { useEffect, useState } from "react";
import axios from "axios";

function Campaigns() {

  const [campaigns, setCampaigns] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns =
    async () => {

      try {

        const response =
          await axios.get(
            `${import.meta.env.VITE_API_URL}/api/campaigns`
          );

        setCampaigns(
          response.data
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    };

  if (loading) {
    return <h2>Loading Campaigns...</h2>;
  }

  return (
    <div className="campaign-page">

      <h1>
        Live Waste Campaigns
      </h1>

      {campaigns.map(
        (campaign, index) => (

          <div
            key={index}
            className="campaign-card"
          >

            <h2>
              {campaign.title}
            </h2>

            <p>
              {campaign.description}
            </p>

            <button
              onClick={() =>
                window.open(
                  campaign.link,
                  "_blank"
                )
              }
            >
              Participate
            </button>

          </div>

        )
      )}

    </div>
  );
}

export default Campaigns;