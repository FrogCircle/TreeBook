'use strict';

angular.module('mean.articles')
//UserController for userProfile page
.controller('UserController', ['$scope', '$upload', 'UserImage', 'GetUserMessages', 'Global',
  function($scope, $upload, UserImage, GetUserMessages, Global){
    $scope.global = Global;

    //watch for image file upload
    $scope.$watch('files', function () {  // user controller
      $scope.upload($scope.files);
    });

    //upload image file
    $scope.upload = function (files) { // user controller
      if (files && files.length) {
<<<<<<< HEAD
=======
        //for (var i = 0; i < files.length; i++) {
        //  var file = files[i];
>>>>>>> Refactored Controllers
        var file = files[0];
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
<<<<<<< HEAD
            console.log('status is ', status);
            console.log('headers is ', headers());
            console.log('config is ', config.transformRequest[0]());
            console.log('args ', arguments);
=======
>>>>>>> Refactored Controllers
            $scope.loadUserImage($scope.image.path);
          });
        }

    };

    //load user image in conjunction with factory UserImage
    $scope.loadUserImage = function(url) { // user controller
      console.log('got into load');
      $scope.user.image = UserImage.loadUserImage(url);
    };

    //get All messages from a User and display on user profile page
    $scope.getUserMessages = function($stateParams) { // user controller
      GetUserMessages.get({ username: $scope.global.user.username }, function(messages) {
        console.log('$scope.messages is ', messages);
        $scope.user = {};
        $scope.user.messages = messages;
        $scope.user.name = $scope.global.user.name;
        $scope.loadUserImage();
      });
    };
}]);
