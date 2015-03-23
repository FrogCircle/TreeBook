'use strict';

angular.module('mean.articles')


// Controller to handle getting tree data
.controller('TreesController', ['$scope', '$resource','$stateParams', 'Trees', 'TreeData', 'GeoCode', 'Global', 'Likes',
  function($scope, $stateParams, $resource, Trees, TreeData, GeoCode, Global, Likes) {
    $scope.likes = [];
    $scope.anyLikes = false;

    //Helper metod to save a like when a user decides to like a tree;
    $scope.like = function(){
      $scope.global = Global;
      var context = $scope.getLikes;
      Likes.saveLike($scope.global.user.username, $scope.tree.treeid, function(){
        context();
      });
    };

    // Helper methos to call TreeData service with to get a specific trees data.
    // The tree is determined by $stateParams (URL)
    $scope.findOne = function() {
      TreeData.getTree().$promise.then(function(tree){
        $scope.tree = tree;
        $scope.getLikes();
      });
    };

    // Search for the tree location based on the address typed in
    $scope.searchTrees = function(){
      var requestAddress = $scope.address;
      console.log(requestAddress);
      var location = GeoCode.getLocation(requestAddress);
      console.log(location);
    };

    $scope.getLikes = function(){
      Likes.getLikes($scope.tree.treeid, function(likes){
        $scope.likes = likes;
        if (likes.length !== 0){
          $scope.anyLikes = true;
        }
      });
    };

  }
]);
