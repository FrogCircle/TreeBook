'use strict';

var pg = require('pg');
var conString = 'postgres://postgres:1234@localhost/postgres';

/**
 * Show an article
 */
exports.getTreeData = function(req, res) {
  console.log('in getTreeData');
  var treeid = req.params.treeId;
  pg.connect(conString, function(err, client, done) {
    var selectMessages = 'SELECT tree.name, q.qspecies, tree.plantdate, l.latitude, l.longitude, image.imageurl, image.imagewidth, image.imageheight, image.imagetype from qspecies q JOIN tree ON (q.qspeciesid = tree.qspeciesid) JOIN "location" l ON (l.locationid = tree.locationid) JOIN image ON (q.qspeciesid = image.qspeciesid) WHERE treeid = $1;';
    client.query(selectMessages, [treeid], function(error, results) {
      done();
      if (error) {
        console.log(error, 'THERE WAS AN ERROR');
      }else{
        res.json(results.rows[0]);
      }
    });
  });
};

/**
 * List of Articles
 */
exports.getAll = function(req, res) {
  console.log('in get All');
  pg.connect(conString, function(err, client, done) {
    console.log(err);
    var selectTrees = 'SELECT tree.name, q.qspecies, l.latitude, l.longitude, thumbnail.url, thumbnail.width, thumbnail.height, thumbnail.contenttype FROM qspecies q JOIN tree ON (q.qspeciesid = tree.qspeciesid) JOIN "location" l ON (l.locationid = tree.locationid) JOIN thumbnail ON (q.qspeciesid = thumbnail.qspeciesid) LIMIT 250;';    client.query(selectTrees, function(error, results) {
    }, function(error, results) {
      done();
      if(error) {
        console.log('Error is ', error);
      }
      console.log(results.rows);
      res.json(results.rows);
    });
  })
};



/*var getTreeInfo = function(req, res) {
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
};*/
