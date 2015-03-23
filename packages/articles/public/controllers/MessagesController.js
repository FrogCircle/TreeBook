'use strict';

angular.module('mean.articles')


/**
 * Handles sumbit message and get all messages on tree profile page
 */
.controller('MessagesController',['$scope','Messages', 'Global','GetMessages', 'TreeData', '$stateParams', 'UserImage', '$timeout',
  function($scope, Messages, Global, GetMessages, TreeData, $stateParams, UserImage, $timeout){

    // $scope.global is necissary to get user information
    $scope.global = Global;
    // the TreeData factory handles the basic tree data. It is in the services folder.
    var treeMessages = [];


    var setParams = function(url, name, treeId){
      treeMessages.forEach(function(message){
        message.imageUrl = url;
        message.username = name;
        message.redirect = '#!/trees/' + treeId;
      });
    };


    $scope.tree = TreeData.getTree(function(t){
      console.log(t.name);
      setParams(t.imageurl, t.name, t.treeid);
    });


    /**
     * Post message to database from single tree profile view
     */
    $scope.submitMessage = function() {
      var message = $scope.inputMessage;
      var username = $scope.global.user.username;
      var treeid = $scope.tree.treeid;
      var body = {
        message: message,
        username: username,
        treeid: treeid
      };

      // Messages is a factory that in services/articles.js
      Messages.save(body, function(data) {
        console.log(data[0]);
        var newMessage = data[0];
        console.log(newMessage.createdat);
        //change date format for each message to readable format
        var date = new Date(newMessage.createdat);
        var options = {
          weekday: 'long', year: 'numeric', month: 'short',
          day: 'numeric', hour: '2-digit', minute: '2-digit'
        };
        newMessage.createdat = date.toLocaleDateString('en-us', options);
        //async load new message to DOM. Loads to end of message list
        $scope.messages.push(newMessage);

        // UserImage is a factory in services/articles.js
        UserImage.loadUserImage(newMessage.username, function(url){
          console.log(url, 'here');
          newMessage.imageUrl = url;
        });

        $scope.inputMessage = '';
      });
    };

    /**
     * get All messages for a Tree and display on tree profile page
     */
    $scope.getMessages = function() {
      // GetMessage is a factory in services/articles.js
      GetMessages.get({ treeid: $stateParams.treeId }, function(messages) {
        $scope.messages = messages;
        $scope.messages.forEach(function(message){
          message.redirect = '#!/user/' + message.username;
          // UserImage is a factory in services/articles.js
          // It is called for each message to get the url of the users picture
          UserImage.loadUserImage(message.username, function(url){
            if (url.length === 0){
              // This is a treemesage
              message.isTree = true;
              treeMessages.push(message);
            } else{
              message.isTree = false; // unused
            }
            message.imageUrl = url;
          });
        });
      });
    };

}]);