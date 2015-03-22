'use strict';

angular.module('mean.articles')

/**
 * Handles Pagination on list page
 */
.controller('PaginationDemoCtrl', ['$scope', 'Trees', 'Search',
  function($scope, Trees, Search) {
    $scope.totalItems = 8;
    var itemsPerPage = 25;
    $scope.currentPage = 1;
    // $scope.trees is an array of arrays. Each subarray is one page which contains tree objects
    $scope.treees = [];

    //Factor out the pagination function to be reused for all the methods
    var paginateTree = function(trees){
      $scope.totalItems = trees.length / itemsPerPage * 8;
      for (var i = 0; i < $scope.totalItems; i = i + 1){
        $scope.treees.push(trees.slice(i * itemsPerPage, (i + 1) * itemsPerPage));
      }
      $scope.trees = trees;
    }

    // Helper method to call Trees factory to get all trees
    $scope.find = function() {
      console.log('find has been called.');
      Trees.query(function(trees) {
        // $scope.totalItems = trees.length / itemsPerPage * 8;
        // for (var i = 0; i < $scope.totalItems; i = i + 1){
        //   $scope.treees.push(trees.slice(i * itemsPerPage, (i + 1) * itemsPerPage));
        // }
        // $scope.trees = trees;
        paginateTree(trees);
      });
    };

    /**
     * function to handle the page setting
     */
    $scope.setPage = function (pageNo) {
      $scope.currentPage = pageNo;
    };

    // Search for the tree location based on the address typed in
    $scope.searchTrees = function(){
      var searchString = $scope.searchString;
      console.log(searchString);
      //location or the other
      var location = Search.getLocation(searchString);
      var lat = location.lat;
      var lng = location.lng;
      if(lat <= -122.368107024455 && lat >= -122.511257155794 && lng <=  37.8103949467147 && lng >=  37.5090039879895) {
        //Search by location
        var body = { longitude: lng, latitude: lat };
        Search.getNearTrees.get({ search: body }, function(results){
          console.log(results);
          paginateTree(results);
        })
      } else {
        //search by name
        Search.getByName.get({ search: searchString }, function(results){
          console.log(results);
          //add the results to the page
          paginateTree(results);
        })
      }
    };
  }
]);
