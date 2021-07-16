const fetch = require("node-fetch");

const Twitter = require("twitter");

const getCustomerKey = require("./seacretDirectory/customerKey");
const getCustomerSeacret = require("./seacretDirectory/customerSeacret");
const getAccsessToken = require("./seacretDirectory/accsessTokenKey");
const getAccsessTokenSeacret = require("./seacretDirectory/accsessTorknSeacret");

// const getGithubCommitCount = async () => {
//   const resp = await fetch("https://api.github.com/users/watataku8911/events");
//   const data = await resp.json();
//   return data;
// };

// getGithubCommitCount().then((resp) => {
//   for (let i = 0; i < resp.length; i++) {
//     // if(resp[i].created_at == "") {

//     // }
//     console.log(resp[i].created_at);
//   }
// });
let client = new Twitter({
  consumer_key: getCustomerKey(),
  consumer_secret: getCustomerSeacret(),
  access_token_key: getAccsessToken(),
  access_token_secret: getAccsessTokenSeacret(),
});

const params = {
  status: "テストです。\n",
};

client.post("statuses/update", params, (error, tweet) => {
  if (!error) {
    console.log("ツイートしました。", tweet);
  } else {
    console.log("エラー", error);
  }
});
