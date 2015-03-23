'use strict';

angular.module('mean.articles')

/**
 * Handles Pagination on list page
 */
.controller('PaginationDemoCtrl', ['$scope', '$state', 'Trees', 'Search',
  function($scope, $state, Trees, Search) {
    $scope.totalItems = 8;
    var itemsPerPage = 25;
    $scope.currentPage = 1;
    // $scope.trees is an array of arrays. Each subarray is one page which contains tree objects
    $scope.treees = [];

    //Factor out the pagination function to be reused for all the methods
    var paginateTree = function(trees){
      $scope.treees = [];
      $scope.totalItems = trees.length / itemsPerPage * 8;
      for (var i = 0; i < $scope.totalItems; i = i + 1){
        $scope.treees.push(trees.slice(i * itemsPerPage, (i + 1) * itemsPerPage));
      }
      $scope.searchString = '';
    };

    // Search by name based on the search String, async promise
    var searchByName = function(searchString){
      console.log('Search by name called');
      searchString = searchString.toLowerCase();
      searchString = searchString[0].toUpperCase() + searchString.slice(1);
      console.log(searchString);
      console.log($state.current.name);
      var body = { search: searchString };
      return Search.getByName().get(body, function(results){
        //add the results to the page
        return results;
      });
    };

    // Search by location based on the string, async promise
    var searchByLocation = function(lat, lng){
      //Search by location
      var body = { longitude: lng, latitude: lat };
      console.log('Search place called');
      console.log($state.current.name);
      return Search.getNearTrees().get(body, function(results){
        return results;
      });
    };

    // Helper method to call Trees factory to get all trees
    $scope.find = function() {
      console.log($state.current.name);
      Trees.query(function(trees) {
        $scope.trees = trees;
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
      //location or the other
      Search.getLocation(searchString).then(function(location){
        //Weird place, is a function to be called location.lat()
        var lat = location.lat();
        var lng = location.lng();
        if(lng <= -122.368107024455 && lng >= -122.511257155794 && lat <= 37.8103949467147 && lat >=  37.5090039879895) {
          searchByLocation(lat, lng).$promise.then(function(results){
            paginateTree(results);
          });
        } else {
          //search by name
          searchByName(searchString).$promise.then(function(results){
            paginateTree(results);
          });
        }
      }, function(status){
        console.log(status + 'address failed');
        //return a promise?
        searchByName(searchString).$promise.then(function(results){
          paginateTree(results);
        });
      }
    );
  };
}]);