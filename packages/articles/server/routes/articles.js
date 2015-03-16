'use strict';

var articles = require('../controllers/articles');

module.exports = function(Articles, app, auth) {

  app.route('/articles')
    .get(articles.getAll);
  app.route('/articles/:treeId')
    .get(articles.getTreeData);

  // if certain route
  // give the function to send data
};
