'use strict';
// sample tree object {name: "tree", qspecies: "Maytenus boaria :: Mayten", picture: "nameless", plantdate: "1969-12-31T06:00:00.000Z", latitude: -122.431434474484…}

angular.module('mean.articles')
.controller('ArticlesController', ['$scope', '$http','$resource','$stateParams',
    '$location', 'Global', 'GetMessages', 'Messages', 'Articles', 'treeData',
    '$upload', 'UserImage', 'GetUserMessages',
  function($scope, $http, $stateParams, $resource, $location, Global, GetMessages,
           Messages, Articles, treeData, $upload, UserImage, GetUserMessages) {
    $scope.global = Global;
    $scope.hasAuthorization = function(article) {
      if (!article || !article.user) return false;
      return $scope.global.isAdmin || article.user._id === $scope.global.user._id;
    };

    $scope.find = function() {
      console.log('find has been called.');
      Articles.query(function(trees) {
        $scope.trees = trees;
      });
    };


    $scope.findOne = function() {
      treeData.getTree().$promise.then(function(tree){
        $scope.tree = tree;
        $scope.getMessages();
      });
    };


    //Post message to database from single tree (profile) view
    //to be able to access tree.treeid, added data-treeid to h3 tag in profile.html
    $scope.submitMessage = function() {
      var message = $scope.message;
      var username = $scope.global.user.username;
      var treeid = $scope.tree.treeid;
      var body = {
        message: message,
        username: username,
        treeid: treeid
      };
      Messages.save(body, function(data) {
        //async load new message to DOM. Loads to end of message list
        $scope.messages.push(data[0]);
        //reset message form to empty
        $scope.message = '';
      });
    };

    //get All messages for a Tree and display on tree profile page
    $scope.getMessages = function($stateParams) {
       GetMessages.get({ treeid: $scope.tree.treeid }, function(messages) {
        console.log('$scope.messages is ', messages);
        $scope.messages = messages;
      });
    };

    $scope.findOneUser = function() {
      //console.log('$scope.global is ', $scope.global);
      //$scope.user = {};
      //$scope.user.name = $scope.global.user.name;
      //console.log('$scope.name is ', $scope.name);
      //treeData.getTree().$promise.then(function(tree){
      //  $scope.tree = tree;
      //  $scope.getMessages();
      //});
    };
    //watch for image file upload
    $scope.$watch('files', function () {
      $scope.upload($scope.files);
    });
    //upload image file
    $scope.upload = function (files) {
      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          $upload.upload({
            url: 'user/image',
            fields: {
              'username': $scope.username
            },
            file: file
          }).progress(function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' +
            evt.config.file.name);
          }).success(function (data, status, headers, config) {
            console.log('file ' + config.file.name + 'uploaded. Response: ' +
            console.log('returned data ', data));
            $scope.image = data;
            console.log('$scope.image is ', $scope.image);
            $scope.loadUserImage($scope.image.path);
          });
        }
      }
    };

    //load user image in conjunction with factory UserImage
    $scope.loadUserImage = function(url) {
      console.log('got into load');
      $scope.user.image = UserImage.loadUserImage(url);
    };

    //get All messages from a User and display on user profile page
    $scope.getUserMessages = function($stateParams) {
      GetUserMessages.get({ username: $scope.global.user.username }, function(messages) {
        console.log('$scope.messages is ', messages);
        $scope.user = {};
        $scope.user.messages = messages;
        $scope.user.name = $scope.global.user.name;
        $scope.loadUserImage();
      });
    };
  }
])

.service('treeData', ['Articles', '$stateParams', function(Articles, $stateParams){

  var getTree = function(){
    return Articles
      .get({ treeId: $stateParams.treeId }, function(t){
        return t;
      });
  };

  return { getTree: getTree };
}])

.controller('PaginationDemoCtrl', function ($scope, $log) {
  $scope.totalItems = 10;
  $scope.currentPage = 1;

  $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };

  $scope.pageChanged = function() {
    $log.log('Page changed to: ' + $scope.currentPage);
  };

  $scope.maxSize = 5;
  $scope.bigTotalItems = 400;
  $scope.bigCurrentPage = 10;
});



