const path = require("path");
const express = require("express");
const createHandler = require("github-webhook-handler");
const slack = require("../libs/slack");
const config = require("../config");

const SECRET = config.githubSecret || process.env.GITHUB_SECRET || process.argv[2] || "";

const handler = createHandler({ path: "/", secret: SECRET });
const router = express.Router();

const getSlackUserNameByGithubId = githubId => config.users[githubId] || githubId;

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

handler.on("pull_request_review_comment", require("../handlers/pull_request_review_comment"));

handler.on("pull_request_review", require("../handlers/pull_request_review"));

handler.on("pull_request", require("../handlers/pull_request"));

module.exports = router;
