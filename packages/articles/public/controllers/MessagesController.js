'use strict';

angular.module('mean.articles')

//Handles sumbit message and get all messages on tree profile page
.controller('MessagesController',['$scope', 'Messages', 'Global',
                                 'GetMessages', 'TreeData', '$stateParams',
  function($scope, Messages, Global, GetMessages, TreeData, $stateParams){
    $scope.global = Global;
    $scope.tree = TreeData.getTree();

    //Post message to database from single tree profile view
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
    $scope.getMessages = function() {
      console.log('in getMessages');
      GetMessages.get({ treeid: $stateParams.treeId }, function(messages) {
        $scope.messages = messages;
      });
    };
}]);
