'use strict';

angular.module('mean.articles')


/**
 * Controller to handle getting tree data
 */
.controller('TreesController', ['$scope', '$resource','$stateParams', 'Trees', 'TreeData', 'Search', 'Global', 'Likes',
  function($scope, $stateParams, $resource, Trees, TreeData, Search, Global, Likes) {
    $scope.likes = [];
    // anyLikes is a boolean used in ng-if to show the like box
    $scope.anyLikes = false;
    /**
     * Helper method to save a like when a user likes a tree
     */
    $scope.like = function(){
      $scope.global = Global;
      var context = $scope.getLikes;
      // Likes is a factory found in services/articles.js
      Likes.saveLike($scope.global.user.username, $scope.tree.treeid, function(){
        // callback to call get likes after adding a like
        context();
      });
    };

    /**
     * Helper methos to call TreeData service with to get a specific trees data.
     */
    $scope.findOne = function() {
      // TreeData is a factory in services/articles.js
      // It determines the tree by looking at the $stateparams
      TreeData.getTree().$promise.then(function(tree){
        $scope.tree = tree;
        console.log(tree);
        $scope.getLikes();
      });
    };

    /**
     * Search for the tree location based on the address typed in
     */
    $scope.searchTrees = function(){
      var searchString = $scope.searchString;
      console.log(searchString);

      var location = Search.getLocation(searchString);
      console.log(location.lat);
      console.log(location.lng);
    };

    /**
     * Helper method to get all likes
     */
    $scope.getLikes = function(){
      // Likes is a factory in services/articles.js
      Likes.getLikes($scope.tree.treeid, function(likes){
        $scope.likes = likes;
        if (likes.length !== 0){
          console.log(likes);
          $scope.anyLikes = true;
        }
      });
    };

  }
]);
