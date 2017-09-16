const path = require("path");
const express = require("express");
const createHandler = require("github-webhook-handler");
const slack = require("../libs/slack");

const SECRET = process.env.GITHUB_SECRET || process.argv[2] || "";

const handler = createHandler({ path: "/", secret: SECRET });
const router = express.Router();

router.all("/*", (req, res) => {
  handler(req, res, err => {
    if (err) {
      res.statusCode = 404;
      res.end("no such location");
      return;
    }
  });
});

handler.on("error", err => {
  console.error("Error:", err.message);
});

handler.on("ping", event => {
  console.log("ping success");
  console.log("ping id: %s", event.id);
});

handler.on("pull_request_review_comment", event => {
  console.log("pull_request_review_comment");
  console.log(event.payload);
});

handler.on("pull_request_review", event => {
  console.log("pull_request_review");
  console.log(event.payload);
});

handler.on("pull_request", event => {
  const { payload } = event;
  const { pull_request, requested_reviewer } = payload;
  console.log(event);
  switch (event.action) {
    case "review_requested":
      const review_to = pull_request.requested_reviewers.map(user => `@${user.login}`);
      const pr_body = `${pull_request.body}`;
      const pr_link = `<${pull_request.html_url}|Review HERE! :rocket:>`;
      const pr_from = `from @${pull_request.user.login}`;

      const pr_message = `Hey smart guys! ${review_to}
      You got a PR review request ${pr_from} - ${pr_link}\`\`\`${pr_body}\`\`\``;

      slack.send(pr_message, function(err, res) {
        if (err) {
          console.log("Error:", err);
        } else {
          console.log("Message sent: ", res);
        }
      });
      break;
  }
});

module.exports = router;
