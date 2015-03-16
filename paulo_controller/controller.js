/**
 * Created by ppp on 3/12/2015.
 */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var routes = require('./routes/index');
var users = require('./routes/users');
var pg = require('pg');
var async = require('async');

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
var conString = "postgres://postgres:1234@localhost/postgres";

/**
 * Gets tree's messages from database and sends it to client. Request is expecting a treeId.
 * @param req
 * @param res
 */
var getMessagesForTree = function(req, res) {
  var treeid = req.body.treeId;
  pg.connect(conString, function(err, client, done) {
    console.log(err);
    var selectMessages = "SELECT message FROM message WHERE treeid = $1 LIMIT 100;";
    client.query(selectMessages, [treeid], function(error, results) {
      res.send(results);
    });
    done();
  });
};
exports.getMessagesForTree = getMessagesForTree;

/**
 * Gets messages from users and sends it to the database. Request is expecting an username.
 * @param req
 * @param res
 */
exports.getMessagesForTree = getMessagesForTree;

var getMessagesForUsers = function(req, res) {
  var username = req.body.username;
  pg.connect(conString, function(err, client, done) {
    console.log(err);
    var selectMessages = "SELECT message FROM message WHERE username = $1;";
    client.query(selectMessages, [username], function(error, results) {
      res.send(results);
    });
    done();
  });
};
exports.getMessagesForUsers = getMessagesForUsers;

/**
 * Get tree info from database and send to client. Request is expecting a treeId.
 * @param req
 * @param res
 */
var getTreeInfo = function(req, res) {
  //var treeid = req.body.treeId;
  var treeid = 50;
  pg.connect(conString, function(err, client, done) {
    console.log(err);
    var selectMessages = 'SELECT tree.name, q.qspecies, tree.plantdate, l.latitude, l.longitude, image.imageurl, image.imagewidth, image.imageheight, image.imagetype from qspecies q JOIN tree ON (q.qspeciesid = tree.qspeciesid) JOIN "location" l ON (l.locationid = tree.locationid) JOIN image ON (q.qspeciesid = image.qspeciesid) WHERE treeid = $1;';
    client.query(selectMessages, [treeid], function(error, results) {
      //res.send(results);
      done();
      console.log(error);
      console.log(results.rows[0]);
    });
  });
};
exports.getTreeInfo = getTreeInfo;

/**
 * Gets messages from both users or trees and uploads them to the database. Request expecting treeName or userName,
 * and a treeId.
 * @param req
 * @param res
 */
var postMessageFromUser = function(req, res) {
  var username = req.body.username;
  var message = req.body.message;
  var treeid = req.body.treeId;
  pg.connect(conString, function(err, client, done) {
    console.log(err);
    var insertMessages = "INSERT INTO message (message, username, treeid) values ($1, $2, $3);";
    client.query(insertMessages, [message, username, treeid], function(error, results) {
      res.send(results);
      done();
    });
  });
};
exports.postMessageFromUser = postMessageFromUser;

exports.getTreeInfo = getTreeInfo;

/**
 * Gets a tree data for 25 trees. This function currently is not using any inputs, but it's expected that it will take
 * current position in the future.
 * @param req
 * @param res
 */
var getTrees = function(req, res) {
  pg.connect(conString, function(err, client, done) {
    console.log(err);
    var selectTrees = 'SELECT tree.name, q.qspecies, l.latitude, l.longitude, thumbnail.url, thumbnail.width, thumbnail.height, thumbnail.contenttype FROM qspecies q JOIN tree ON (q.qspeciesid = tree.qspeciesid) JOIN "location" l ON (l.locationid = tree.locationid) JOIN thumbnail ON (q.qspeciesid = thumbnail.qspeciesid) LIMIT 25;';
    client.query(selectTrees, function(error, results) {
    }, function(error, results) {
      done();
      console.log(results);
      console.log(error);
      console.log(results.rows);
    });
  })
};
exports.getTrees = getTrees;

app.get('/profile', checkifloggedin, handler.renderIndex);
app.get('/search', checkifloggedin, handler.renderIndex);

app.get('/usermessages', checkifloggedin, getMessagesForUsers());
app.post('/usermessages', checkifloggedin, postMessageFromUser());
app.get('/treemssages', checkifloggedin, getMessagesForTree());
app.post('/treemessages', checkifloggedin, postMessageFromUser);

app.get('/*', controller.navToLink);


getTreeInfo("hello", "yes");

module.exports = app;
