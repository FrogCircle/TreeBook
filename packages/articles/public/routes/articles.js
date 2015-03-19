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
      .state('tree profile page', {
        url: '/trees/profile',
        templateUrl: 'articles/views/profile.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('single tree display', {
        url: '/trees/:treeId',
        templateUrl: 'articles/views/profile.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('user profile page', {
        url: '/user/:userId',
        templateUrl: 'articles/views/userProfile.html',
        resolve: {
          loggedin: checkLoggedin
        }
      });
  }
]);
