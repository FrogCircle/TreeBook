'use strict';

var articles = require('../controllers/articles');

module.exports = function(Articles, app, auth) {
  //use multer middleware for image uploads
  var multer = require('multer');
  var done = false;
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
        // res does exist here now :)
        res.json({
          message: "Upload failed",
          status: MARankings.Enums.Status.FILE_TOO_LARGE
          // status: -6
        });
      },
      onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...')
      },
      onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path)
        done=true;
        res.send(file);
      }

    });
    handler(req, res, next);
  });
/*  app.use(multer({ dest: './uploads/',
    rename: function (fieldname, filename) {
      return filename+Date.now();
    },
    onFileUploadStart: function (file) {
      console.log(file.originalname + ' is starting ...')
    },
    onFileUploadComplete: function (file) {
      console.log(file.fieldname + ' uploaded to  ' + file.path)
      done=true;
    }
  }));*/


  app.route('/articles').get(articles.getAll);
  app.route('/articles/:treeId').get(articles.getTreeData);

  app.route('/usermessages').get(articles.getMessagesForUsers);
  app.route('/usermessages').post(articles.postMessageFromUser);
  app.route('/treemessages/:treeid').get(articles.getMessagesForTree);
  app.route('/treemessages').post(articles.insertMessagesFromTrees);
  app.route('/user/image').post(function(req, res) {
    console.log('req.files ', req.files);
  });



  // if certain route
  // give the function to send data
};
