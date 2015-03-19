'use strict';

angular.module('mean.articles')

// Controller to handle getting tree data
.controller('TreesController', ['$scope', '$resource','$stateParams', 'Trees', 'TreeData',
  function($scope, $stateParams, $resource, Trees, TreeData) {

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
<<<<<<< HEAD
        console.log('tree caretaker ', tree.caretaker);
=======
>>>>>>> Refactor controllers into their own files
        $scope.tree = tree;
      });
    };

  }
]);
