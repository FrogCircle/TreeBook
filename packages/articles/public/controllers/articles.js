'use strict';
// sample tree object {name: "tree", qspecies: "Maytenus boaria :: Mayten", picture: "nameless", plantdate: "1969-12-31T06:00:00.000Z", latitude: -122.431434474484…}

angular.module('mean.articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Global', 'Articles',
  function($scope, $stateParams, $location, Global, Articles) {
    $scope.global = Global;
    $scope.hasAuthorization = function(article) {
      if (!article || !article.user) return false;
      return $scope.global.isAdmin || article.user._id === $scope.global.user._id;
    };

    $scope.find = function() {
      console.log('find has been called.');
      Articles.query(function(trees) {
        console.log('trees is ', trees);
        $scope.trees = trees;
        console.log('$scope.trees is ', $scope.trees);
      });
    };

    $scope.findOne = function() {
      console.log('findOne has been called.');
      Articles.get({
        treeId: $stateParams.treeId
      }, function(tree) {
        console.log(tree);
        $scope.tree = tree;
      });
    };
  }
]);
