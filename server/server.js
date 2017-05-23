'use strict';

var cors = require('cors');
var unirest = require("unirest");
var bodyParser = require('body-parser')

const config = require('./config.js').default;

var express = require('express');
var app = express();
app.use(bodyParser());

app.post('/gittoken', cors(), function (req, res) {
    requestGithubToken(config.gitOAuthUrl, config.gitClientId, config.gitClientSecret, req.query.code)
            .then((data) => {
                if (data.error) {
                    console.log('Error requesting token', data.error_description);
                    res.status(500).send(data.error_description);
                    return null;
                }
                res.send(data.access_token);
            }, err => {
                console.log('Error requesting token', err);
                res.status(500).send(err);
            });
});

app.all('*', cors(), function(req, res) {
    let token = req.get('authorization').substr(6);

    let url = "https://" + config.gitAPIHost + req.url;
    var req = unirest(req.method, url, req.body);
    req.headers({
        // "cache-control": "no-cache",
        "accept": "application/json",
        "Authorization": "token " + token,
        "User-Agent": 'Sprinty'
    });
    req.end(function (_res) {
        if (_res.error) {
            res.status(_res.statusCode).send(_res.error);
            // console.log(_res.body);
            return;
        }

        res.send(_res.body);
    });
})

app.listen(8989, function () {
  console.log('Example app listening on port 8989!');
});

export function requestGithubToken(gitOAuthUrl, client_id, client_secret, code) {
    // console.log('Requesting Token for code', code);
    if (code==='' || code==null) {
        return Promise.reject('No code Present');
    }

    var req = unirest
        .post(`${gitOAuthUrl}/access_token`)
        .query({
            client_id,
            client_secret,
            code
        })

    req.headers({
        // "cache-control": "no-cache",
        "accept": "application/json"
    });


    return new Promise((resolve, reject) => {
        req.end(function (_res) {
            if (_res.error) {
                reject(_res.error);
                return;
            };

            // console.log(_res.body);
            resolve(_res.body);
        })
    });
}
