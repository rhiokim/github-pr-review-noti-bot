const config = require("../config");
const getSlackUserNameByGithubId = githubId => config.users[githubId] || githubId;

module.exports = {
  getSlackUserNameByGithubId
};
