var IncomingWebhook = require("@slack/client").IncomingWebhook;

var url =
  process.env.SLACK_WEBHOOK_URL || "https://hooks.slack.com/services/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"; //see section above on sensitive data

var webhook = new IncomingWebhook(url, {
  username: "My custom username",
  iconEmoji: ":slack:",
  channel: "#iot",
  linkNames: 1
});

module.exports = webhook;
