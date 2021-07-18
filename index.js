"use strict";

const cron = require("node-cron");
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

// 24時に実行
cron.schedule("0 0 0 * * *", () => {
  getGithubCommitCount()
    .then((resp) => {
      let count = 0;
      for (let i = 0; i < resp.length; i++) {
        if (resp[i].created_at.substr(0, 10) == stringToday()) {
          count++;
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
