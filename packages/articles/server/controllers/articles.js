'use strict';
var azure = require('azure-storage');
var pg = require('pg');
var conString = 'postgres://' + process.env.POSTGRES + '/postgres';
var retryOperations = new azure.ExponentialRetryPolicyFilter();
var blobSvc = azure.createBlobService().withFilter(retryOperations);
blobSvc.createContainerIfNotExists('userpictures', {publicAccessLevel : 'blob'}, function(error, result, response){
  if(!error){
    console.log(error);
    console.log(result);
    console.log(response);
  }
});

/**
 * Get tree data for a single tree (profile view)
 */
exports.getTreeData = function(req, res) {
  var treeid = req.params.treeId;
  pg.connect(conString, function(err, client, done) {
    var selectMessages = 'SELECT tree.name, tree.treeid, q.qspecies, tree.plotsize, tree.qcaretaker, tree.plantdate, l.latitude, l.longitude, image.imageurl, image.imagewidth, image.imageheight, image.imagetype from qspecies q JOIN tree ON (q.qspeciesid = tree.qspeciesid) JOIN "location" l ON (l.locationid = tree.locationid) JOIN image ON (q.qspeciesid = image.qspeciesid) WHERE treeid = $1;';
    client.query(selectMessages, [treeid], function(error, results) {
      done();
      if (error) {
        console.log(error, 'THERE WAS AN ERROR');
      } else {
        res.json(results.rows[0]);
      }
    });
  });
};

/**
 * Get tree data for 250 trees (list view)
 */
exports.getAll = function(req, res) {
  pg.connect(conString, function(err, client, done) {
    console.log(err);
    var selectTrees = 'SELECT tree.name, tree.treeid, q.qspecies, l.latitude, l.longitude, thumbnail.url, thumbnail.width, thumbnail.height, thumbnail.contenttype FROM qspecies q JOIN tree ON (q.qspeciesid = tree.qspeciesid) JOIN "location" l ON (l.locationid = tree.locationid) JOIN thumbnail ON (q.qspeciesid = thumbnail.qspeciesid) LIMIT 250;';
    client.query(selectTrees, function(error, results) {
    }, function(error, results) {
      done();
      if (error) {
        console.log('Error is ', error);
      }
      res.json(results.rows);
    });
  });
};

/**
 * Gets tree's messages from database and sends it to client. Request is expecting a treeId.
 * @param req
 * @param res
 */
exports.getMessagesForTree = function(req, res) {
  var treeid = req.params.treeid;
  console.log('in getMessageForTree and treeid is', treeid);
  pg.connect(conString, function(err, client, done) {
    console.log(err);
    var selectMessages = 'SELECT message.message, message.treeid, message.username, message.messageid, message.createdAt FROM message  WHERE treeid = $1 LIMIT 100;';
    client.query(selectMessages, [treeid], function(error, results) {
      res.json(results.rows);
    });
    done();
  });
};

/**
 * Gets messages from users and sends it to the database. Request is expecting an username.
 * @param req
 * @param res
 */
exports.getMessagesForUsers = function(req, res) {
  var username = req.params.userid;
  console.log('in getMessageForUsers and username is', username);
  pg.connect(conString, function(err, client, done) {
    console.log(err);
    var selectMessages = 'SELECT message.message, message.treeid, message.username, message.messageid, message.createdAt FROM message WHERE username = $1 LIMIT 100;';
    client.query(selectMessages, [username], function(error, results) {
      console.log('results.rows is ', results.rows);
      res.json(results.rows);
    });
    done();
  });
};

/**
 * Gets messages from both users or trees and uploads them to the database. Request expecting treeName or userName,
 * and a treeId.
 * @param req
 * @param res
 */
//
exports.postMessageFromUser = function(req, res) {
  console.log('got into postMessageFromUser');
  var username = req.body.username;
  var message = req.body.message;
  var treeid = req.body.treeid;
  console.log(username, message, treeid);
  pg.connect(conString, function(err, client, done) {
    if (err) {
      console.log('error is', err);
    }
    else {
      var insertMessages = 'INSERT INTO message (message, username, treeid) values ($1, $2, $3) RETURNING *;';
      client.query(insertMessages, [message, username, treeid], function(error, results) {
        console.log('postMessageFromUser result is ', results.rows);
        res.json(results.rows);
        done();
      });
    }
  });
};

/**
 * Search tree return 250 results matching the search params. It takes a search param, and an offset. If offset is not
 * provided it will default to 0.
 * @param req
 * @param res
 */
exports.searchTrees = function(req, res) {
  var search = req.search;
  var offset = req.offset || 0;
  var searchString = typeof search === 'string' ? '%' + search + '%' : 'do not use';
  var searchNum = typeof search === 'number' ? search : 0;
  pg.connect(conString, function(err, client, done) {
    console.log('in search trees');
    console.log(err);
    var selectTrees = 'SELECT tree.name, q.qspecies, l.latitude, l.longitude, thumbnail.url, thumbnail.width, ' +
      'thumbnail.height, thumbnail.contenttype FROM qspecies q JOIN tree ON (q.qspeciesid = tree.qspeciesid) JOIN ' +
      '"location" l ON (l.locationid = tree.locationid) JOIN thumbnail ON (q.qspeciesid = thumbnail.qspeciesid) WHERE ' +
      'tree.treeid = $1 OR tree.name LIKE $2 OR q.qspecies = $2 OR q.qspeciesid = $1 LIMIT 250 OFFSET $3;';
    client.query(selectTrees, [searchNum, searchString, offset], function(error, results) {
      console.log('error', error);
      //console.log('results', results);
      console.log(results.rows);
      done();
    });
  });
};

/**
 * This function expects a treeid to insert messages. The userid will be saved with the value of -1 which means that
 * the message was sent by the tree.
 * @param req
 * @param res
 */
exports.insertMessagesFromTrees = function(req, res) {
  console.log('got into insertMessagesFromTrees is ');
  var treeid = req.body.treeid;
  var userid = -1;
  var message = req.body.message;
  console.log(treeid, userid, message);
  pg.connect(conString, function(err, client, done) {
    console.log(err);
    var selectMessages = 'INSERT INTO message (message, treeid, userid) values($1, $2, $3)';
    client.query(selectMessages, [message, treeid, userid], function(error, results) {
      console.log('results is ', results);
      res.send(results);
      done();
    });
  });
};

/**
 * Inserts likes into database. This takes username and treeid.
 * @param req
 * @param res
 */
exports.insertLikes = function(req, res) {
  var treeid = req.body.treeid;
  var username = req.body.username;
  pg.connect(conString, function(err, client, done) {
    console.log(err);
    var insertLikes = 'INSERT INTO likes (username, treeid) values($1, $2)';
    client.query(insertLikes, [username, treeid], function(error, results) {
      console.log('results is ', results);
      res.send(results);
      done();
    });
  });
};

/**
 * This gets a list of trees that the user likes. It takes an username.
 * @param req
 * @param res
 */
exports.getTreeLikes = function(req, res) {
  var username = req.body.username;
  pg.connect(conString, function(err, client, done) {
    console.log(err);
    var selectLikes = 'SELECT tree.name, q.qspecies, thumbnail.url, thumbnail.width, thumbnail.height, ' +
      'thumbnail.contenttype FROM qspecies q JOIN tree ON (q.qspeciesid = tree.qspeciesid) JOIN thumbnail ON ' +
      '(q.qspeciesid = thumbnail.qspeciesid) JOIN likes ON (tree.treeid = likes.treeid)' + ' WHERE likes.username = $1;';
    client.query(selectLikes, [username], function(error, results) {
      console.log('results is ', results);
      res.send(results);
      done();
    });
  });
};

/**
 * This gets a list of users which like a particular tree. It takes a treeid.
 * @param req
 * @param res
 */
exports.getUserLikes = function(req, res) {
  var treeid = req.body.treeid;
  pg.connect(conString, function(err, client, done) {
    console.log(err);
    var selectLikes = 'SELECT userid from likes WHERE likes.treeid = $1;';
    client.query(selectLikes, [treeid], function(error, results) {
      console.log('results is ', results);
      res.send(results);
      done();
    });
  });
};

/**
 * Insert comments for a message into comments table. This takes a username, comment, treeid, and messageid.
 * @param req
 * @param res
 */
exports.insertComments = function(req, res) {
  console.log('insert comments');
  var username = req.body.username;
  var comment = req.body.comment;
  var treeid = req.body.treeid;
  var messageid = req.message.messageid;
  console.log(username, message, treeid);
  pg.connect(conString, function(err, client, done) {
    if (err) {
      console.log('error is', err);
    }
    else {
      var insertComments = 'INSERT INTO comment (comment, username, treeid, messageid) values ($1, $2, $3, $5) RETURNING *;';
      client.query(insertComments, [comment, username, treeid, messageid], function(error, results) {
        console.log('postCommentFromUser result is ', results.rows);
        res.json(results.rows);
        done();
      });
    }
  });
};

/**
 * Gets comments from the database for a particular message. This takes a messageid.
 * @param req
 * @param res
 */
exports.getComments = function(req, res) {
  var messageid = req.params.messageid;
  console.log('in getComment');
  pg.connect(conString, function(err, client, done) {
    console.log(err);
    var selectMessages = 'SELECT comment.comment, message.treeid, message.username, comment.createdAt FROM comments  WHERE messageid = $1 LIMIT 100;';
    client.query(selectMessages, [messageid], function(error, results) {
      res.json(results.rows);
    });
    done();
  });
};
//This can be refactored to store image in DB instead of locally in folder
exports.uploadUserImage = function(req, res) {
  var image = req.image;
  blobSvc.createBlockBlobFromStream('userpictures', 'dinizappfiles', 'test.txt', function(error, result, response){
    if(!error){
      // file uploaded
    }
  });
};
