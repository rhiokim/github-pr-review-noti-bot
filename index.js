const http = require("http");
const express = require("express");
const path = require("path");
const displayRoutes = require("express-routemap");
const pkg = require("./package.json");

const app = express();
const PORT = process.env.PORT || 8082;

const webhook = require("./routes/webhook");

app.use("/webhook", webhook);

app.get("/", (req, res) => {
  res.send(`${pkg.name} v${pkg.version}`);
});

http.createServer(app).listen(PORT, () => {
  displayRoutes(app);
});
