const slack = require("../libs/slack");
const { getSlackUserNameByGithubId } = require("../libs/helper");

module.exports = event => {
  console.log("pull_request_review_comment.js");
  const { payload } = event;
  const { comment, pull_request } = payload;
  const comment_from = `@${getSlackUserNameByGithubId(comment.user.login)}`;
  const comment_body = `> ${comment.body}`;
  const comment_link = `<${comment.html_url}|Comment HERE! :speaking_head_in_silhouette:>`;
  const pr_link = `<${pull_request.html_url}|PR-#${pull_request.number}>`;

  // If commenting user equal to PR user, don't send any message to slack
  if (comment.user.login === pull_request.user.login) {
    return;
  }

  switch (payload.action) {
    case "created":
      const comment_message = `Hey @${getSlackUserNameByGithubId(pull_request.user.login)}
    You got comments from ${comment_from} about your ${pr_link} - ${comment_link}`; //\n${comment_body}

      slack.send(comment_message, function(err, res) {
        if (err) {
          console.log("Error:", err);
        } else {
          console.log("Message sent: ", res);
        }
      });
      break;
  }
};
