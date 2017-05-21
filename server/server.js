'use strict';

var cors = require('cors');
var storage = require('node-persist');
storage.initSync();
var unirest = require("unirest");
var github = require('octonode');
var bodyParser = require('body-parser')

const config = require('../config.js').default;

var express = require('express');
var app = express();
app.use(bodyParser());

// github.auth.config({
//   id: 'https://' + config.gitAPIHost,
//   secret: config.gitClientSecret,
//   apiUrl: 'https://' + config.gitAPIHost,
//   webUrl: 'https://github.bus.zalan.do/'
// });

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
    var client = github.client(token, { hostname: config.gitAPIHost });

    function callback(err, status, body, headers) {
        if (err) {
            res.status(err.statusCode).send(err);
        }
        res.send(body);
    };

    let request = req.url;
    // console.log(req.method, request, req.body);
    if (req.method === 'GET') {
        client.get(req.path, {}, callback)
    }
    if (req.method === 'PATCH') {
        client.patch(req.path, req.body, callback)
    }
    if (req.method === 'PUT') {
        client.put(req.path, req.body, {}, callback)
    }
    if (req.method === 'POST') {
        client.post(req.path, req.body, {}, callback)
    }
})

app.listen(8989, function () {
  console.log('Example app listening on port 8989!');
});

export function requestGithubToken(gitOAuthUrl, client_id, client_secret, code) {
    console.log('Requesting Token for code', code);
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
            };

            console.log('Token response', _res.body);
            resolve(_res.body);
        })
    });
}
