'use strict';

angular.module('mean.articles')

/**
 * Handles Pagination on list page
 */
  .controller('PaginationDemoCtrl', ['$scope', '$state', 'Trees', 'Search', '$http',
    /**
     *
     * @param $scope
     * @param $state
     * @param Trees
     * @param Search
     */
    function($scope, $state, Trees, Search, $http) {
      $scope.totalItems = 8;
      var itemsPerPage = 25;
      $scope.currentPage = 1;
      // $scope.trees is an array of arrays. Each subarray is one page which contains tree objects
      $scope.treees = [];
      $scope.newTree = {};
      //'/articles/new'
      //944 Market St #8, San Francisco, CA 94102
      $scope.addTree = function(tree){
        Search.getLocation(tree.address)
          .then(function (result) {
            var location = {};
            location.latitude = result.lat();
            location.longitude = result.lng();
            tree.treeid = Math.floor(500000 + (Math.random() * 100000));
            tree.location = location;
            tree.qspecies = 'Tree(s) ::';
            console.log(tree);
            return tree;
          })
          .then(function (tree){
            return $http({
              method: 'POST',
              url: 'articles/new',
              data: tree
            })
            .then(function (result) {
              console.log('added new tree', result);
            });
          })
          .catch(function (err) {
            console.log(err);
          });
      };

      //Factor out the pagination function to be reused for all the methods
      /**
       *
       * @param trees
       */
      var paginateTree = function(trees) {

        $scope.treees = [[]];

        if (trees.length > 8) {
          $scope.totalItems = Math.ceil(trees.length / itemsPerPage * 8) ;
          for (var i = 0; i < $scope.totalItems; i = i + 1) {
            $scope.treees.push(trees.slice(i * itemsPerPage, (i + 1) * itemsPerPage));
          }
        } else {
          $scope.totalItems = trees.length;
          var t = [];
          for (var j = 0; j < trees.length; j = j + 1) {
            t.push(trees[j]);
          }
          $scope.treees.push(t);
        }
        $scope.searchString = '';
      };

      // Search by name based on the search String, async promise
      /**
       *
       * @param searchString
       * @returns {*}
       */
      var searchByName = function(searchString) {
        console.log('Search by name called');
        searchString = searchString.toLowerCase();
        searchString = searchString[0].toUpperCase() + searchString.slice(1);
        console.log(searchString);
        console.log($state.current.name);
        var body = {search: searchString};
        return Search.getByName().get(body, function(results) {
          //add the results to the page
          return results;
        });
      };

      // Search by location based on the string, async promise
      /**
       *
       * @param lat
       * @param lng
       * @returns {*}
       */
      var searchByLocation = function(lat, lng) {
        //Search by location
        var body = {longitude: lng, latitude: lat};
        console.log('Search place called');
        console.log($state.current.name);
        return Search.getNearTrees().get(body, function(results) {
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
      $scope.setPage = function(pageNo) {
        $scope.currentPage = pageNo;
      };

      // Search for the tree location based on the address typed in
      $scope.searchTrees = function() {
        var searchString = $scope.searchString;
        //location or the other
        Search.getLocation(searchString).then(function(location) {
            //Weird place, is a function to be called location.lat()
            var lat = location.lat();
            var lng = location.lng();
            if (lng <= -122.368107024455 && lng >= -122.511257155794 && lat <= 37.8103949467147 && lat >= 37.5090039879895) {
              searchByLocation(lat, lng).$promise.then(function(results) {
                paginateTree(results);
              });
            } else {
              //search by name
              searchByName(searchString).$promise.then(function(results) {
                console.log(results);
                paginateTree(results);
              });
            }
          }, function(status) {
            console.log(status + 'address failed');
            //return a promise?
            searchByName(searchString).$promise.then(function(results) {
              paginateTree(results);
            });
          }
        );
      };
    }]);
