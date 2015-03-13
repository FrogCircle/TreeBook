'use strict';

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
