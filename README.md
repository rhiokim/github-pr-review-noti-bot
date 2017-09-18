# Github Pull Request Notification Bot

[about this project]

## How it works

github webhook events(PullRequest, PullRequestReview, PullRequestReviewComment) -> this -> slack send

## How to use this

```bash
$ now deploy
  -e GITHUB_SECRET=1234 \
  -e SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T05A4C0D1/C486BBCEK/XfJ3D \
  -e SLACK_BOT_NAME=GithubBot
  -e SLACK_BOT_ICON=:slack:
  -e SLACK_CHANNEL=#general
```

or

create `config.json`

## License
MIT