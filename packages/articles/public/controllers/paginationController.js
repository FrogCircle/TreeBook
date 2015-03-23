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

    //Factor out the pagination function to be reused for all the methods
    var paginateTree = function(trees){
      $scope.treees = [];
      $scope.totalItems = trees.length / itemsPerPage * 8;
      for (var i = 0; i < $scope.totalItems; i = i + 1){
        $scope.treees.push(trees.slice(i * itemsPerPage, (i + 1) * itemsPerPage));
      }
      $scope.trees = trees;
    };

    // Search by name based on the search String, async promise
    var searchByName = function(searchString){
      console.log('Search by name called');
      var body = { search: searchString };
      return Search.getByName().get(body, function(results){
        console.log(results);
        //add the results to the page
        return results;
      });
    };

    // Search by location based on the string, async promise
    var searchByLocation = function(lat, lng){
      //Search by location
      var body = { longitude: lng, latitude: lat };
      console.log('Search place called');
      return Search.getNearTrees().get(body, function(results){
        console.log(results);
        return results;
      });
    };

    // Helper method to call Trees factory to get all trees
    $scope.find = function() {
      console.log('find has been called.');
      Trees.query(function(trees) {
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
      Search.getLocation(searchString).then(function(location){
        console.log('check location in bound');
        console.log(location);
        //Weird place, is a function to be called
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
