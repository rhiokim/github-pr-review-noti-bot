const { getSlackUserNameByGithubId } = require("../libs/helper");

module.exports = event => {
  const { payload } = event;
  const { pull_request, requested_reviewer } = payload;

  switch (payload.action) {
    case "review_requested":
      const review_to = `@${getSlackUserNameByGithubId(pull_request.requested_reviewer.login)}`;
      const pr_body = pull_request.body
        .split("\n")
        .map(line => `> ${line}`)
        .join("\n");
      const pr_link = `<${pull_request.html_url}|Review HERE! :rocket:>`;
      const pr_from = `from @${getSlackUserNameByGithubId(pull_request.user.login)}`;

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
};
