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
        console.log('trees is ', trees);
        $scope.trees = trees;
      });
    };
    $scope.findOne = function() {
      $scope.tree = treeData.getTree();
      treeData.promise.$promise.then(function(){
        $scope.tree = treeData.getTree();
        console.log($scope.tree);
      });
    };
  }
]);

// .service('treeData', ['Articles', '$stateParams', function(Articles, $stateParams){
//   var tree = null;
//   console.log($stateParams.treeId);
//   var promise = Articles.get({
//       treeId: $stateParams.treeId
//     }, function(t) {
//       tree = t;
//     });
//   return {
//     promise:promise,
//     getTree: function(){
//       return tree;
//     }
//   };
// }
// ]);
