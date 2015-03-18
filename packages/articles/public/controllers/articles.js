'use strict';
// sample tree object {name: "tree", qspecies: "Maytenus boaria :: Mayten", picture: "nameless", plantdate: "1969-12-31T06:00:00.000Z", latitude: -122.431434474484…}

angular.module('mean.articles')
.controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Global', 'Articles', 'treeData',
  function($scope, $stateParams, $location, Global, Articles, treeData) {    $scope.global = Global;
    $scope.hasAuthorization = function(article) {
      if (!article || !article.user) return false;
      return $scope.global.isAdmin || article.user._id === $scope.global.user._id;
    };

    $scope.find = function() {
      console.log('find has been called.');
      Articles.query(function(trees) {
        $scope.trees = trees;
      });
    };

    $scope.findOne = function() {
      treeData.getTree().$promise.then(function(tree){
        $scope.tree = tree;
      });
    };
  }
])

.service('treeData', ['Articles', '$stateParams', function(Articles, $stateParams){

  var getTree = function(){
    console.log(Articles);
    return Articles
      .get({ treeId: 298 }, function(t){
        return t;
      });
  };

  return { getTree: getTree };
}]);
