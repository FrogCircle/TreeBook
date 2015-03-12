'use strict';

var articles = require('../controllers/articles');

module.exports = function(Articles, app, auth) {

  app.route('/articles')
    .get(articles.all);
  app.route('/articles/:articleId')
    .get(auth.isMongoId, articles.show);

  // Finish with setting up the articleId param
  app.param('articleId', articles.article);
};
