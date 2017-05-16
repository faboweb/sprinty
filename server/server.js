'use strict';

const Hapi = require('hapi');
const Octokat = require('octokat');
const superagent = require('superagent');
const config = require('../config.js').default;
// const {initGitHub, getProjects} = require('./github-projects.js');

var express = require('express');
var app = express();

// Add the route
app.get('/milestones/:owner/:repo', function (req, res) {
    let token = config.token;

    let url = config.host + `/repos/${req.params.owner}/${req.params.repo}/issues`;
    console.log('Url', url);
    superagent
        .get(url)
        .set('Authorization', `token ${token}`)
        // .set('Content-Type', 'application/json')
        // .set('Accept','application/vnd.github.inertia-preview+json')
        .end(function(err, result) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(result)
            }
        });
});

app.listen(8989, function () {
  console.log('Example app listening on port 8989!');
});