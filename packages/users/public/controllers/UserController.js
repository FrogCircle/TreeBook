'use strict';

angular.module('mean.articles')

//UserController for userProfile page
.controller('UserController', ['$scope', '$upload', 'UserImage', 'GetUserMessages', 'Global', 'TreeImage', 'UserLikes',
  function($scope, $upload, UserImage, GetUserMessages, Global, TreeImage, UserLikes){
    $scope.global = Global;
    $scope.likes = [];
    $scope.anyLikes = false;

    //watch for image file upload
    $scope.$watch('files', function () {  // user controller
      $scope.upload($scope.files);
    });

    $scope.getLikes = function(){
      UserLikes.getLikes($scope.user.name, function(likes){
        $scope.likes = likes;
        if (likes.length !== 0){
          $scope.anyLikes = true;
        }
      });
    };

    //upload image file
    $scope.upload = function (files) { // user controller
      var thisUser = $scope.global.user.username;
      if (files && files.length) {
        var file = files[0];
        $upload.upload({
            url: 'user/image',
            fields: {
              'username': thisUser
            },
            file: file
          }).progress(function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' +
            evt.config.file.name);
          }).success(function (data, status, headers, config) {
            $scope.image = data;
            if( $scope.image.uploadError ) {
              $scope.user.uploadError = $scope.image.uploadError;
              console.log('error on hand');
            } else {
              $scope.user.uploadError = '';
              $scope.loadUserImage($scope.image.path);
              UserImage.saveUserImage(thisUser, $scope.image.path);
            }
          });
        }

    };

    //load user image in conjunction with factory UserImage
    $scope.loadUserImage = function(username) {
      var context = $scope.user;
      UserImage.loadUserImage(username, function(imageUrl){
        context.image = imageUrl;
      });
    };

    //get All messages from a User and display on user profile page
    $scope.getUserMessages = function($stateParams) {
      GetUserMessages.get({ username: $scope.global.user.username }, function(messages) {
        $scope.user = {};
        $scope.user.messages = messages;
        $scope.user.messages.forEach(function(message){
          TreeImage.loadTreeImage(message.treeid, function(url){
            message.imageUrl = url;
          });
        });

        $scope.user.name = $scope.global.user.name;
        $scope.loadUserImage($scope.global.user.username);
        $scope.getLikes();
      });
    };

}]);