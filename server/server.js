'use strict';

const superagent = require('superagent');
var cors = require('cors');
var storage = require('node-persist');
storage.initSync();

const config = require('../config.js').default;
// const {initGitHub, getProjects} = require('./github-projects.js');

var express = require('express');
var app = express();

// Add the route
app.all('/git*', cors(), function (req, res) {
    function request(token) {
        // console.log('Token', token);
        return superagent(req.method, config.gitAPIHost + req.params[0])
            .set('Authorization', `token ${token}`)
            // .set('Accept', 'application/json')
            .end((err, _res) => res.send(err || _res.body));
    }

    let token = storage.getItemSync(req.query.code)
    // console.log('Token', token);
    if (token == null) {
        requestGithubToken(config.gitOAuthUrl, config.gitClientId, config.gitClientSecret, req.query.code)
            .then((data) => {
                if (data.error) {
                    console.log('Error requesting token', data.error_description);
                    storage.removeItemSync(req.query.code);
                    res.status(500).send(data.error_description);
                    return null;
                }
                storage.setItemSync(req.query.code, data.access_token);
                request(data.access_token);
            }, err => {
                console.log('Error requesting token', err);
                res.status(500).send(err);
            });
    } else {
        request(token);
    }
});

app.listen(8989, function () {
  console.log('Example app listening on port 8989!');
});

export function requestGithubToken(gitOAuthUrl, client_id, client_secret, code) {
    console.log('Requesting Token at', gitOAuthUrl);
    if (code==='' || code==null) {
        return Promise.reject('No code Present');
    }
    return superagent
        .post(`${gitOAuthUrl}/access_token`)
        .query({
            client_id,
            client_secret,
            code
        })
        .set('Accept', 'application/json')
        // .then((response) => response.json())
        .then(res => res.body)
}
