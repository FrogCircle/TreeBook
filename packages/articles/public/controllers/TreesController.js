'use strict';

angular.module('mean.articles')

// Controller to handle getting tree data
.controller('TreesController', ['$scope', '$resource','$stateParams', 'Trees', 'TreeData', 'GeoCode',
  function($scope, $stateParams, $resource, Trees, TreeData, GeoCode) {

    // Helper method to call Trees factory to get all trees
    $scope.find = function() {
      console.log('find has been called.');
      Trees.query(function(trees) {
        $scope.trees = trees;
      });
    };

    // Helper methos to call TreeData service with to get a specific trees data.
    // The tree is determined by $stateParams (URL)
    $scope.findOne = function() {
      TreeData.getTree().$promise.then(function(tree){
        $scope.tree = tree;
      });
    };

    // Search for the tree location based on the address typed in
    $scope.searchTrees = function(){
      var requestAddress = $scope.address;
      console.log(requestAddress);
      var location = GeoCode.getLocation(requestAddress);
      console.log(location);
    };
  }
]);
