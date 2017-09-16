const path = require("path");
const express = require("express");
const createHandler = require("github-webhook-handler");

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
  console.log("pull_request");
  console.log(pull_request.requested_reviewers);
});

module.exports = router;
