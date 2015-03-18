'use strict';

var articles = require('../controllers/articles');

module.exports = function(Articles, app, auth) {

  app.route('/articles').get(articles.getAll);
  app.route('/articles/:treeId').get(articles.getTreeData);

  app.route('/usermessages').get(articles.getMessagesForUsers);
  app.route('/usermessages').post(articles.postMessageFromUser);
  app.route('/treemessages/:treeid').get(articles.getMessagesForTree);
  app.route('/treemessages').post(articles.insertMessagesFromTrees);


  // if certain route
  // give the function to send data
};
