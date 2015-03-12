'use strict';

var articles = require('../controllers/articles');

module.exports = function(Articles, app, auth) {

  app.route('/articles')
    .get(articles.all);
  app.route('/articles/:articleId')
    .get(auth.isMongoId, articles.show);

};
