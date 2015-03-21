'use strict';

var articles = require('../controllers/articles');

module.exports = function(Articles, app, auth) {
  var multer = require('multer');

  //use multer middleware for image uploads, max size 500kb
  app.use('/user/image', function(req, res, next) {
    var handler = multer({
      dest: 'packages/theme/public/assets/img/uploads/',
      limits: {
        fileSize: 500000
      },
      rename: function (fieldname, filename, req, res) {
        return filename+Date.now();
      },
      onFileSizeLimit: function (file) {
        res.json({
          uploadError: 'Upload failed. File must be less than 500 KB'
        });
      },
      onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...');
      },
      onFileUploadComplete: function (file, req, res) {
        console.log(file.fieldname + ' uploaded to  ' + file.path);
        //console.log('new name is', req.files.file[0].name);
        //console.log('req.user.username', req.user.username);
        var newFileName = req.files.file[0].name;
        articles.uploadUserImage(req, res, newFileName, function(){
          file.path = 'https://treebooktest.blob.core.windows.net/userpictures/' + newFileName;
          //load user image
          res.send(file);
        });
        //done=true;
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
/*
  app.route('/user/image').post(function(req, res) {
    console.log('req is ', req);
    //var username = req.user.username;
    //var newFileName = req.files.file[0].name;
    //articles.uploadUserImage(req, res, newFileName, username);
  });
*/

};
