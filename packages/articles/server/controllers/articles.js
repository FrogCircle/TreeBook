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
    var selectMessages = 'select tree.name, q.qspecies, q.picture, tree.plantdate, l.latitude, l.longitude from qspecies q join tree ON (q.qspeciesid = tree.qspeciesid) join "location" l ON (l.locationid = tree.locationid) where treeid = $1;';
    client.query(selectMessages, [treeid], function(error, results) {
      done();
      if (err) {
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
  console.log('in All');
  pg.connect(conString, function(err, client, done) {
    var selectTrees = 'select treeid, tree.name, q.qspecies, q.picture, l.latitude, l.longitude from qspecies q join tree ON (q.qspeciesid = tree.qspeciesid) join "location" l ON (l.locationid = tree.locationid) LIMIT 25;';
    client.query(selectTrees, function(error, results) {
    }, function(error, results) {
      res.json(results.rows);
    });
  });
};
