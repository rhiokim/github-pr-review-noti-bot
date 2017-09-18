const path = require("path");
const express = require("express");
const createHandler = require("github-webhook-handler");
const slack = require("../libs/slack");
const config = require("../config");

const SECRET = config.githubSecret || process.env.GITHUB_SECRET || process.argv[2] || "";

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
  const { payload } = event;
  const { comment, pull_request } = payload;
  const comment_from = `@${comment.user.login}`;
  const comment_body = `> ${comment.body}`;
  const comment_link = `<${comment.html_url}|Comment HERE! :speaking_head_in_silhouette:>`;
  const pr_link = `<${pull_request.html_url}|PR>`;

  switch (payload.action) {
    case "created":
      const comment_message = `Hey @${pull_request.user.login}
    You got comments from ${comment_from} about your ${pr_link} - ${comment_link}\n${comment_body}`;

      slack.send(comment_message, function(err, res) {
        if (err) {
          console.log("Error:", err);
        } else {
          console.log("Message sent: ", res);
        }
      });
      break;
  }
});

handler.on("pull_request_review", event => {
  console.log("pull_request_review");
  console.log(event.payload);
});

handler.on("pull_request", event => {
  const { payload } = event;
  const { pull_request, requested_reviewer } = payload;

  switch (payload.action) {
    case "review_requested":
      const review_to = pull_request.requested_reviewers.map(user => `@${user.login}`);
      const pr_body = pull_request.body
        .split("\n")
        .map(line => `> ${line}`)
        .join("\n");
      const pr_link = `<${pull_request.html_url}|Review HERE! :rocket:>`;
      const pr_from = `from @${pull_request.user.login}`;

      const pr_message = `Hey ${review_to}\nYou got a PR review request ${pr_from} - ${pr_link}\n${pr_body}`;

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
