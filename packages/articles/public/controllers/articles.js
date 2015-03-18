'use strict';
// sample tree object {name: "tree", qspecies: "Maytenus boaria :: Mayten", picture: "nameless", plantdate: "1969-12-31T06:00:00.000Z", latitude: -122.431434474484…}

angular.module('mean.articles')
.controller('ArticlesController', ['$scope', '$http','$resource','$stateParams', '$location', 'Global', 'GetMessages', 'Messages', 'Articles', 'treeData',
  function($scope, $http, $stateParams, $resource, $location, Global, GetMessages, Messages, Articles, treeData) {
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
      var username = $scope.tree.name;
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



