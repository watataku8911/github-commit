"use strict";
const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

const fetch = require("node-fetch");
const Twitter = require("twitter");

const getCustomerKey = require("./seacretDirectory/customerKey");
const getCustomerSeacret = require("./seacretDirectory/customerSeacret");
const getAccsessToken = require("./seacretDirectory/accsessTokenKey");
const getAccsessTokenSeacret = require("./seacretDirectory/accsessTorknSeacret");

const client = new Twitter({
  consumer_key: getCustomerKey(),
  consumer_secret: getCustomerSeacret(),
  access_token_key: getAccsessToken(),
  access_token_secret: getAccsessTokenSeacret(),
});

const getGithubCommitCount = async () => {
  const resp = await fetch("https://api.github.com/users/watataku8911/events");
  const data = await resp.json();
  return data;
};

// 昨日の日付を取得
const stringToday = () => {
  const today = new Date();

  today.setDate(today.getDate() - 1);
  const year = today.getFullYear();
  const month = ("0" + (today.getMonth() + 1)).slice(-2);
  const day = ("0" + today.getDate()).slice(-2);

  return year + "-" + month + "-" + day;
};

//get
app.get("/api", (req, res) => {
  res.json({ message: "Bad Request" });
});

app.post("/api", (req, res) => {
  getGithubCommitCount()
    .then((resp) => {
      let count = 0;
      for (let i = 0; i < resp.length; i++) {
        if (resp[i].created_at.substr(0, 10) == stringToday()) {
          count++;
        } else {
          break;
        }
      }
      const params = {
        status:
          "今日のコミット数は" +
          count +
          "です。\n" +
          "\n" +
          "https://github.com/watataku8911",
      };
      client.post("statuses/update", params, (error, tweet) => {
        if (!error) {
          console.log("ツイートしました。", tweet);
        } else {
          console.log("エラー", error);
        }
      });
    })
    .catch(() => {
      console.log("Githubデータを取得できませんでした。");
    });
});

app.put("/api", (req, res) => {
  res.json({ message: "Bad Request" });
});

app.delete("/api", (req, res) => {
  res.json({ message: "Bad Request" });
});

const port = process.env.PORT || 3080;
app.listen(port);
console.log("ポート番号" + port + "でWebサーバが立ち上がりました");
