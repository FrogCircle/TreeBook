'use strict';

angular.module('mean.articles')

// Handles Pagination on list page
.controller('PaginationDemoCtrl', ['$scope', 'Trees',
  function($scope, Trees) {
    $scope.totalItems = 8;
    // For some reason the number of pages will be totalItems / 8
    var itemsPerPage = 25;
    $scope.currentPage = 1;
    $scope.treees = [];

    // Helper method to call Trees factory to get all trees
    $scope.find = function() {
      console.log('find has been called.');
      Trees.query(function(trees) {
        $scope.totalItems = trees.length / itemsPerPage * 8;
        for (var i = 0; i < $scope.totalItems; i = i + 1){
          $scope.treees.push(trees.slice(i * itemsPerPage, (i + 1) * itemsPerPage));
        }
        $scope.trees = trees;
      });
    };

    $scope.setPage = function (pageNo) {
      $scope.currentPage = pageNo;
    };

  }
]);
