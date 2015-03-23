'use strict';

angular.module('mean.articles')


// Controller to handle getting tree data
.controller('TreesController', ['$scope', '$resource','$stateParams', 'Trees', 'TreeData', 'Search',
  function($scope, $stateParams, $resource, Trees, TreeData, Search) {


    // Helper methods to call TreeData service with to get a specific trees data.
    // The tree is determined by $stateParams (URL)
    $scope.findOne = function() {
      TreeData.getTree().$promise.then(function(tree){
        $scope.tree = tree;
      });
    };
  }
]);
