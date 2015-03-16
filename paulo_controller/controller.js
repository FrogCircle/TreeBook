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
    var selectMessages = 'SELECT tree.name, q.qspecies, tree.plantdate, l.latitude, l.longitude, image.imageurl, ' +
      'image.imagewidth, image.imageheight, image.imagetype from qspecies q JOIN tree ON (q.qspeciesid = ' +
      'tree.qspeciesid) JOIN "location" l ON (l.locationid = tree.locationid) JOIN image ON (q.qspeciesid = ' +
      'image.qspeciesid) WHERE treeid = $1;';
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
 * Gets a tree data for 250 trees. This function takes an offset. If the offset is not provided it will default to 0;
 * @param req
 * @param res
 */
var getTrees = function(req, res) {
  var offset = req.offset || 0;
  pg.connect(conString, function(err, client, done) {
    console.log(err);
    var selectTrees = 'SELECT tree.name, q.qspecies, l.latitude, l.longitude, thumbnail.url, thumbnail.width, ' +
      'thumbnail.height, thumbnail.contenttype FROM qspecies q JOIN tree ON (q.qspeciesid = tree.qspeciesid) ' +
      'JOIN "location" l ON (l.locationid = tree.locationid) JOIN thumbnail ON (q.qspeciesid = thumbnail.qspeciesid) ' +
      'LIMIT 250 OFFSET $1;';
    client.query(selectTrees, [offset], function(error, results) {
      done();
      console.log(results.rows);
    });
  })
};
exports.getTrees = getTrees;

/**
 * Search tree return 250 results matching the search params. It takes a search param, and an offset. If offset is not
 * provided it will default to 0.
 * @param req
 * @param res
 */
var searchTrees = function(req, res) {
  var search = req.search;
  var offset = req.offset || 0;
  var search = "Briana";
  var searchString = typeof search === "string" ? "%" + search + "%" : "do not use";
  var searchNum = typeof search === "number" ? search : 0;
  var offset = 0;
  pg.connect(conString, function(err, client, done) {
    console.log("in search trees");
    console.log(err);
    var selectTrees = 'SELECT tree.name, q.qspecies, l.latitude, l.longitude, thumbnail.url, thumbnail.width, ' +
      'thumbnail.height, thumbnail.contenttype FROM qspecies q JOIN tree ON (q.qspeciesid = tree.qspeciesid) JOIN ' +
      '"location" l ON (l.locationid = tree.locationid) JOIN thumbnail ON (q.qspeciesid = thumbnail.qspeciesid) WHERE ' +
      'tree.treeid = $1 OR tree.name LIKE $2 OR q.qspecies = $2 OR q.qspeciesid = $1 LIMIT 250 OFFSET $3;';
    client.query(selectTrees, [searchNum, searchString, offset], function(error, results){
      console.log('error', error);
      //console.log('results', results);
      console.log(results.rows);
      done();
    });
  })
};
exports.searchTrees = searchTrees;

app.get('/profile', checkifloggedin, handler.renderIndex);
app.get('/search', checkifloggedin, handler.renderIndex);

app.get('/usermessages', checkifloggedin, getMessagesForUsers());
app.post('/usermessages', checkifloggedin, postMessageFromUser());
app.get('/treemssages', checkifloggedin, getMessagesForTree());
app.post('/treemessages', checkifloggedin, postMessageFromUser);

app.get('/*', controller.navToLink);


getTreeInfo("hello", "yes");

module.exports = app;
