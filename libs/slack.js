const IncomingWebhook = require("@slack/client").IncomingWebhook;

const url = process.env.SLACK_WEBHOOK_URL;
const webhook = new IncomingWebhook(url, {
  username: process.env.SLACK_BOT_NAME || "GITHUB_PR_BOT",
  iconEmoji: ":slack:",
  channel: process.env.SLACK_CHANNEL || "#general",
  linkNames: 1
});

module.exports = webhook;
