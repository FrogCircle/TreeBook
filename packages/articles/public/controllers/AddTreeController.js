'use strict';

angular.module('mean.articles')
  
  .controller('AddTreeController', ['$scope',
    /*
    * @param #scope
    *
    *
    *
    */
    function ($scope) {
      $scope.tree = {};
      $scope.addTree = function (tree) {
        console.log(tree);
      };
    }

  ]);