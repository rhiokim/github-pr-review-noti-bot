const slack = require("../libs/slack");
const { getSlackUserNameByGithubId } = require("../libs/helper");

const _cache = {};
const reduceReviewRequestedNotification = (prNum, reviewer, next) => {
  let pr;
  if (!_cache.hasOwnProperty(prNum)) {
    _cache[prNum] = {
      tid: null,
      reviewers: []
    };
  }

  pr = _cache[prNum];

  if (pr.tid) {
    clearTimeout(pr.tid);
    pr.tid = undefined;
  }

  pr.reviewers.push(reviewer);
  pr.tid = setTimeout(() => {
    next(pr.reviewers);
    pr = _cache[prNum] = null;
    delete _cache[prNum];
  }, 2000);
};

module.exports = event => {
  console.log("pull_request.js");
  const { payload } = event;
  const { pull_request, requested_reviewer, number } = payload;

  switch (payload.action) {
    case "review_requested":
      const review_to = `@${getSlackUserNameByGithubId(requested_reviewer.login)}`;
      const pr_body = pull_request.body
        .split("\n")
        .map(line => `> ${line}`)
        .join("\n");
      const pr_link = `<${pull_request.html_url}|${pull_request.title} - #${number} :rocket:>`;
      const pr_from = `from @${getSlackUserNameByGithubId(pull_request.user.login)}`;

      // const pr_message = `Hey ${review_to}\nYou got a PR review request ${pr_from} - ${pr_link}\n${pr_body}`;

      reduceReviewRequestedNotification(number, requested_reviewer.login, reviewers => {
        const review_to = reviewers.map(reviewer => `@${getSlackUserNameByGithubId(reviewer)}`).join(", ");
        const pr_message = `Hey ${review_to}\nYou got a PR review request ${pr_from} - ${pr_link}\n${pr_body}`;
        slack.send(pr_message, function(err, res) {
          if (err) {
            console.log("Error:", err);
          } else {
            console.log("Message sent: ", res);
          }
        });
      });
      break;
  }
};
