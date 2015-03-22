'use strict';

angular.module('mean.articles')

// Handles Pagination on list page
.controller('PaginationDemoCtrl', ['$scope', 'Trees', 'Search',
  function($scope, Trees, Search) {
    $scope.totalItems = 8;
    // For some reason the number of pages will be totalItems / 8
    var itemsPerPage = 25;
    $scope.currentPage = 1;
    $scope.treees = [];

    //Factor out the pagination function to be reused for all the methods
    var paginateTree = function(trees){
      $scope.totalItems = trees.length / itemsPerPage * 8;
      for (var i = 0; i < $scope.totalItems; i = i + 1){
        $scope.treees.push(trees.slice(i * itemsPerPage, (i + 1) * itemsPerPage));
      }
      $scope.trees = trees;
    };

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
        console.log(lat, lng);
        if(lng <= -122.368107024455 && lng >= -122.511257155794 && lat <= 37.8103949467147 && lat >=  37.5090039879895) {
            //Search by location
          var body = { longitude: lng, latitude: lat };
          console.log('Search place called');
          Search.getNearTrees().get({ search: body }, function(results){
            console.log(results);
            paginateTree(results);
          });
        } else {
          //search by name
          console.log('Search by name called');
          Search.getByName().get({ search: searchString }, function(results){
            console.log(results);
            //add the results to the page
            paginateTree(results);
          });
        }
      }, function(status){
        console.log(status + 'address failed');
      }
    );
  };
}]);
