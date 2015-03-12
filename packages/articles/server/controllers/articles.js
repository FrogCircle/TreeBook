'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Article = mongoose.model('Article');


/**
 * Find article by id
 */
exports.article = function(req, res, next, id) {
  Article.load(id, function(err, article) {
    if (err) return next(err);
    if (!article) return next(new Error('Failed to load article ' + id));
    req.article = article;
    next();
  });
};


/**
 * Show an article
 */
exports.show = function(req, res) {

  // PAULO WILLS SEND US CODE
  res.json(req.article);
};

/**
 * List of Articles
 */
exports.all = function(req, res) {
  // PAULO WILL SEND US CODE
    res.json(req.articles);
};
