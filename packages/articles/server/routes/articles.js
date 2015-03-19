'use strict';

var articles = require('../controllers/articles');

module.exports = function(Articles, app, auth) {
  var multer = require('multer');
  var done = false;

  //use multer middleware for image uploads, max size 500kb
  app.use('/user/image', function(req, res, next) {
    var handler = multer({
      dest: 'packages/theme/public/assets/img/uploads/',
      limits: {
        fileSize: 500000
      },
      rename: function (fieldname, filename) {
        return filename+Date.now();
      },
      onFileSizeLimit: function (file) {
        res.json({
          message: 'Upload failed'
        });
      },
      onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...');
      },
      onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path);
        done=true;
        res.send(file);
      }

    });
    handler(req, res, next);
  });



  app.route('/articles').get(articles.getAll);
  app.route('/articles/:treeId').get(articles.getTreeData);

  app.route('/usermessages/:userid').get(articles.getMessagesForUsers);
  app.route('/usermessages').post(articles.postMessageFromUser);
  app.route('/treemessages/:treeid').get(articles.getMessagesForTree);
  app.route('/treemessages').post(articles.insertMessagesFromTrees);
  //the app.use middleware route above with multer handles file uploads
  app.route('/user/image').post(function(req, res) {
    console.log('req.files ', req.files);
  });

};
