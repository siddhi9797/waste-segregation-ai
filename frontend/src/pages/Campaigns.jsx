import { useEffect, useState } from "react";
import axios from "axios";

function Campaigns() {

  const [campaigns, setCampaigns] =
    useState([]);

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

      }

    };

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

            <h3>
              {campaign.title}
            </h3>

            <p>
              {campaign.description}
            </p>

            <a
              href={campaign.link}
              target="_blank"
              rel="noreferrer"
            >
              Participate →
            </a>

          </div>

        )
      )}

    </div>
  );
}

export default Campaigns;