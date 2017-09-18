const IncomingWebhook = require("@slack/client").IncomingWebhook;
const config = require("../config");

const url = config.slackWebhookUrl || process.env.SLACK_WEBHOOK_URL;
const webhook = new IncomingWebhook(url, {
  username: config.botName || process.env.SLACK_BOT_NAME || "GITHUB_PR_BOT",
  iconEmoji: config.iconEmoji || process.env.SLACK_BOT_ICON || ":slack:",
  channel: config.defaultChannel || process.env.SLACK_CHANNEL || "#general",
  linkNames: 1
});

module.exports = webhook;
