const Parser = require("rss-parser");
const NodeCache = require("node-cache");

const parser = new Parser();

const cache = new NodeCache({
  stdTTL: 3600, // 1 hour
});

const getCampaigns = async (req, res) => {
  try {
    const cachedData = cache.get("campaigns");

    if (cachedData) {
      return res.json(cachedData);
    }

    const feeds = [
      "https://www.unep.org/rss.xml",
      "https://wwf.panda.org/rss/news/",
    ];

    let campaigns = [];

    for (const feedUrl of feeds) {
      try {
        const feed = await parser.parseURL(feedUrl);

        const items = feed.items.map((item) => ({
          title: item.title,
          description:
            item.contentSnippet ||
            item.content ||
            item.summary ||
            "",
          link: item.link,
          pubDate: item.pubDate,
        }));

        campaigns.push(...items);
      } catch (err) {
        console.log(
          `Failed feed: ${feedUrl}`
        );
      }
    }

    campaigns = campaigns
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
      message:
        "Failed to fetch campaigns",
    });
  }
};

module.exports = {
  getCampaigns,
};