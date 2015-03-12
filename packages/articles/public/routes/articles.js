'use strict';

//Setting up route
angular.module('mean.articles').config(['$stateProvider',
  function($stateProvider) {
    // Check if the user is connected
    var checkLoggedin = function($q, $timeout, $http, $location) {
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user) {
        // Authenticated
        if (user !== '0') $timeout(deferred.resolve);

        // Not Authenticated
        else {
          $timeout(deferred.reject);
          $location.url('/login');
        }
      });

      return deferred.promise;
    };

    // states for my app
    $stateProvider
      .state('all trees', {
        url: '/trees',
        templateUrl: 'articles/views/list.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('tree display', {
        url: '/about',
        templateUrl: 'articles/views/create.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('profile page', {
        url: '/trees/profile',
        templateUrl: 'articles/views/profile.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('arcticle display', {
        url: '/trees/:articleId',
        templateUrl: 'articles/views/view.html',
        resolve: {
          loggedin: checkLoggedin
        }
      });
  }
]).controller('PaginationDemoCtrl', function ($scope, $log) {
  $scope.totalItems = 64;
  $scope.currentPage = 4;

  $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };

  $scope.pageChanged = function() {
    $log.log('Page changed to: ' + $scope.currentPage);
  };

  $scope.maxSize = 5;
  $scope.bigTotalItems = 175;
  $scope.bigCurrentPage = 1;
});