const fetch = require("node-fetch");
const express = require("express");
const app = express();

app.get('/api', (req, res) => {
    
    const getGithubCommitCount = async () => {
        const resp = await fetch("https://api.github.com/users/watataku8911/events")
        const data = await resp.json()
        return data
    }

    getGithubCommitCount().then((resp) => {
        for(let i = 0; i < resp.length; i++) {
            // if(resp[i].created_at == "") {

            // }
            //res.json(resp[i].created_at)
            console.log(resp[i].created_at);
        }
    })
});

const port = process.env.PORT || 3080;
app.listen(port);
console.log("ポート番号" + port + "でWebサーバが立ち上がりました");

 