const axios = require("axios");
const NodeCache = require("node-cache");

const cache = new NodeCache({
  stdTTL: 21600, // 6 hours
});

const getCampaigns = async (req, res) => {
  try {

    const cachedData =
      cache.get("campaigns");

    if (cachedData) {
      return res.status(200).json(
        cachedData
      );
    }

    const searchQuery =
      "waste management campaigns India OR recycling drive India OR environmental cleanup campaigns";

    const response =
      await axios.get(
        "https://www.googleapis.com/customsearch/v1",
        {
          params: {
            key:
              process.env.GOOGLE_API_KEY,
            cx:
              process.env.GOOGLE_SEARCH_ENGINE_ID,
            q: searchQuery,
            num: 10,
          },
        }
      );

    const campaigns =
      response.data.items?.map(
        (item) => ({
          title: item.title,
          description:
            item.snippet,
          link: item.link,
        })
      ) || [];

    cache.set(
      "campaigns",
      campaigns
    );

    res.status(200).json(
      campaigns
    );

  } catch (error) {

  console.log(
    "Campaign Error:",
    error.response?.data || error.message
  );

  res.status(500).json({
    error: error.response?.data || error.message,
  });

}
};

module.exports = {
  getCampaigns,
};