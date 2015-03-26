'use strict';

angular.module('mean.articles')

//UserController for userProfile page
  .controller('UserController', ['$scope', '$stateParams', '$upload', 'UserImage', 'GetUserMessages', 'Global', 'TreeImage', 'UserLikes', 'UserInfo',
    /**
     *
     * @param $scope
     * @param $stateParams
     * @param $upload
     * @param UserImage
     * @param GetUserMessages
     * @param Global
     * @param TreeImage
     * @param UserLikes
     * @param UserInfo
     */
      function($scope, $stateParams, $upload, UserImage, GetUserMessages, Global, TreeImage, UserLikes, UserInfo) {
      $scope.global = Global;
      $scope.likes = [];
      $scope.user = {};
      $scope.user.updates = [{status: 'i like trees'}];
      console.log($scope.user.updates);
      $scope.anyLikes = false;
      $scope.imagesLoaded = false;
      var contextUsername = $stateParams.userId;
      $scope.isProfileOwner = (contextUsername === $scope.global.user.username);

      //watch for image file upload
      $scope.$watch('files', function() {  // user controller
        $scope.upload($scope.files);
      });



      $scope.getLikes = function() {
        console.log($stateParams);
        UserLikes.getLikes(contextUsername, function(likes) {
          $scope.likes = likes;
          if (likes.length !== 0) {
            $scope.anyLikes = true;
          }
        });

      };

      /**
       * upload image file
       * @param files
       */
      $scope.upload = function(files) { // user controller
        console.log('stateParams', $stateParams);
        var thisUser = contextUsername;
        if (files && files.length) {
          var file = files[0];
          $upload.upload({
            url: 'user/image',
            fields: {
              'username': thisUser
            },
            file: file
          }).progress(function(evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' +
            evt.config.file.name);
          }).success(function(data, status, headers, config) {
            $scope.image = data;
            if ($scope.image.uploadError) {
              $scope.user.uploadError = $scope.image.uploadError;
              console.log('error on hand');
            } else {
              $scope.user.uploadError = '';
              UserImage.saveUserImage(thisUser, $scope.image.path, function(data) {
                $scope.loadUserImage(data.username);
              });
            }
          });
        }

      };

      /**
       * load user image in conjunction with factory UserImage
       * @param username
       */
      $scope.loadUserImage = function(username) {
        UserImage.loadUserImage(username, function(imageUrl) {
          var random = (new Date()).toString();
          //append a random string as a param to force ng-src to reload the image
          $scope.user.image = imageUrl + '?cb=' + random;
        });
      };

      /**
       * get All messages from a User and display on user profile page
       * @param $stateParams
       */
      $scope.getUserMessages = function($stateParams) {
        GetUserMessages.get({username: contextUsername}, function(messages) {
          $scope.user.messages = messages;
          $scope.user.messages.forEach(function(message) {
            TreeImage.loadTreeImage(message.treeid, function(url) {
              message.imageUrl = url;
            });
          });
          $scope.imagesLoaded = true;

          $scope.user.name = contextUsername;
          $scope.loadUserImage(contextUsername);
          $scope.getLikes();
        });
      };


      /**
       * get UserInfo
       * @param user with name property
       */
       $scope.getUserInfo = function(user) {
        console.log('getting stuff', user.name);
        UserInfo.get(user.name)
          .then(function (res) {
            console.log('before loading', $scope.user);
            $scope.user.updates = res.data.updates;
            console.log('finish loading', $scope.user);
          });
       };

      $scope.init = function () {
        $scope.getUserMessages();
        $scope.getUserInfo({name: contextUsername});
      };

      $scope.updateStatus = function (user, message) {
        UserInfo.post(user.name, message)
          .then(function (res) {
            $scope.user.updates.push(res.data);
          });
        };
    }]);
