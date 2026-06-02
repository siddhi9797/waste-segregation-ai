const Parser = require("rss-parser");
const NodeCache = require("node-cache");

const parser = new Parser();

const cache = new NodeCache({
  stdTTL: 3600,
});

const getCampaigns = async (req, res) => {
  try {
    const cachedData = cache.get("campaigns");

    if (cachedData) {
      return res.json(cachedData);
    }

const feeds = [
  "https://news.google.com/rss/search?q=waste+management+India",
  "https://news.google.com/rss/search?q=recycling+campaign+India",
  "https://news.google.com/rss/search?q=plastic+waste+cleanup+India",
];

    let campaigns = [];

    for (const feedUrl of feeds) {
      try {
        const feed = await parser.parseURL(feedUrl);

        const items = feed.items.map((item) => ({
          title: item.title || "Untitled",

          description: (
            item.contentSnippet ||
            item.summary ||
            item.content ||
            "No description available"
          )
            .replace(/<[^>]*>/g, "")
            .replace(/\s+/g, " ")
            .trim()
            .substring(0, 250),

          link: item.link,

          pubDate: item.pubDate
            ? new Date(item.pubDate)
            : new Date(),
        }));

        campaigns.push(...items);
      } catch (err) {
        console.log(
          `Failed to fetch ${feedUrl}:`,
          err.message
        );
      }
    }

    campaigns = campaigns
      .filter(
        (item) =>
          item.title &&
          item.description
      )
      .sort(
        (a, b) =>
          new Date(b.pubDate) -
          new Date(a.pubDate)
      )
      .slice(0, 20);

    cache.set(
      "campaigns",
      campaigns
    );

    res.json(campaigns);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch campaigns",
    });
  }
};

module.exports = {
  getCampaigns,
};