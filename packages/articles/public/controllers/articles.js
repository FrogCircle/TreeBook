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
        console.log('trees is ', trees);
        $scope.trees = trees;
      });
    };
    $scope.findOne = function() {
      $scope.tree = treeData.getTree();
      treeData.promise.$promise.then(function(){
        $scope.tree = treeData.getTree();
        console.log($scope.tree)
      })
      .then(function() {
        $scope.getMessages();
      });
    };
    //Post message to database from single tree (profile) view
    //to be able to access tree.treeid, added data-treeid to h3 tag in profile.html
    $scope.submitMessage = function() {
      console.log("inside submit  ");
      var message = $scope.postMessage;
      var username = $scope.tree.name;
      var treeid = $scope.tree.treeid;
      var body = {
        message: message,
        username: username,
        treeid: treeid
      };
      Messages.save(body)
        .then(function(data) {
        /*      //not getting any data back from server on POST so below isn't working
         console.log("response data is ", data);
         $scope.prependItem = function() {
         $scope.messages.unshift({
         message: data
         });
         };
         */
        console.log('data is', data);
/*        data.$save(function (data) {
          console.log("got into data.$save");
          $scope.getMessages();
        });*/
      });

      //reset form to empty
      $scope.postMessage = "";
      //this call to getMessages will be removed once we are getting the data back from post submit
    };

    //get All messages for a Tree and display on tree profile page
    $scope.getMessages = function($stateParams) {
      //console.log("getMessages $scopr.tree.treeid ", $scope.tree.treeid);
       GetMessages.get({ treeid: $scope.tree.treeid }, function(messages) {
        console.log("$scope.messages is ", messages);
        $scope.messages = messages;
      });


    };
  }
])

.service('treeData', ['Articles', '$stateParams', function(Articles, $stateParams){
  var tree = null;
  var promise = Articles.get({
      treeId: $stateParams.treeId
    }, function(t) {
      tree = t;
    });
  return {
    promise: promise,
    getTree: function(){
      return tree;
    }
  };
}
]);



