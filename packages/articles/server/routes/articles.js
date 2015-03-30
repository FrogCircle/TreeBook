'use strict';
var fs = require('fs');
var articles = require('../controllers/articles');

module.exports = function(Articles, app, auth) {
  var multer = require('multer');

  //use multer middleware for image uploads, max size 500kb
  //middleware active for any route
  //image uploads are coming in on '/user/image'
  app.use(function(req, res, next) {
    var fileTooLarge = false;
    var handler = multer({
      dest: 'packages/theme/public/assets/img/uploads/',
      limits: {
        fileSize: 500000
      },
      rename: function (fieldname, filename, req, res) {
        var username = req.user.username;
        return username + '001';
      },
      onFileSizeLimit: function (file) {
        fileTooLarge = true;
        res.json({
          uploadError: 'Upload failed. File must be less than 500 KB'
        });
      },
      onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...');
      },
      onFileUploadComplete: function (file, req, res) {
        console.log(file.fieldname + ' uploaded to  ' + file.path);
        var newFileName = req.files.file[0].name;
        if(!fileTooLarge) {
          articles.uploadUserImage(req, res, newFileName, function() {
            file.path = 'http://dinizcdnstorage.blob.core.windows.net/userpictures/' + newFileName;
            //file param is actually an object with the path as a property
            res.send(file);
            //delete file from local uploads folder
            fs.unlink('packages/theme/public/assets/img/uploads/' + newFileName);
          });
        } else {
          fs.unlink('packages/theme/public/assets/img/uploads/' + newFileName);
        }
      }
    });
    handler(req, res, next);
  });



  app.route('/articles').get(articles.getAll);
  app.route('/articles/:treeId').get(articles.getTreeData);
  //endpoint to add new tree
  app.route('/articles/new').post(articles.addTree);

  app.route('/usermessages/:userid').get(articles.getMessagesForUsers);
  app.route('/usermessages').post(articles.postMessageFromUser);
  app.route('/treemessages/:treeid').get(articles.getMessagesForTree);
  app.route('/treemessages').post(articles.insertMessagesFromTrees);
  //the app.use middleware route above uses multer to handle file uploads
  app.route('/user/image').post(function(req, res) {});
  app.route('/treelike').post(articles.insertLikes);
  app.route('/treelikes').post(articles.getUserLikes);
  app.route('/userlikes').post(articles.getTreeLikes);
  app.route('/treeimage/:treeId').get(articles.getTreeImage);


  app.route('/searchbyloc').get(articles.findTreesByLocation);
  app.route('/searchbyname/:search').get(articles.searchTrees);
  //the app.use middleware route above with multer handles file uploads
  //we don't need to set up a route for /user/images/ b/c multer handles it

};
