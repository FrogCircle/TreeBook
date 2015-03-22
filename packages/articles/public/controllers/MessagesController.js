'use strict';

angular.module('mean.articles')

//Handles sumbit message and get all messages on tree profile page
.controller('MessagesController',['$scope','Messages', 'Global','GetMessages',
                                  'TreeData', '$stateParams', 'UserImage',
  function($scope, Messages, Global, GetMessages, TreeData, $stateParams, UserImage){
    $scope.global = Global;
    console.log('Global is ', Global);
    $scope.tree = TreeData.getTree();

    //Post message to database from single tree profile view
    $scope.submitMessage = function() {
      var message = $scope.inputMessage;
      var username = $scope.global.user.username;
      var treeid = $scope.tree.treeid;
      var body = {
        message: message,
        username: username,
        treeid: treeid
      };
      Messages.save(body, function(data) {
        var newMessage = data[0];
        //change date format for each message to readable format
        var date = new Date(newMessage.createdat);
        var options = {
          weekday: 'long', year: 'numeric', month: 'short',
          day: 'numeric', hour: '2-digit', minute: '2-digit'
        };
        newMessage.createdat = date.toLocaleDateString('en-us', options);
        //async load new message to DOM. Loads to end of message list

        $scope.messages.push(newMessage);

        UserImage.loadUserImage(newMessage.username, function(url){
          console.log(url, 'here');
          newMessage.imageUrl = url;
        });

        $scope.inputMessage = '';
      });
    };

    //get All messages for a Tree and display on tree profile page
    $scope.getMessages = function() {
      GetMessages.get({ treeid: $stateParams.treeId }, function(messages) {
        $scope.messages = messages;
        $scope.messages.forEach(function(message){
          UserImage.loadUserImage(message.username, function(url){
            message.imageUrl = url;
          });
        });
      });
    };
}]);
