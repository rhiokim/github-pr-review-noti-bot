const slack = require("../libs/slack");

module.exports = event => {
  console.log("pull_request_review");
  const { payload } = event;

  switch (payload.action) {
    case "submitted":
      console.log("code review submitted");
      break;
  }
};
