'use strict';

angular.module('mean.users')

.factory('MeanUser', [

  function() {
    return {
      name: 'users'
    };
  }
])

// Factory to retrieve tree images
.factory('TreeImage', ['$http',
  function($http, $stateParams) {
    var imageStore = {};

    var loadTreeImage = function(treeId, cb) {
      if (imageStore[treeId]){
        cb(imageStore[treeId]);
      } else {
        $http.get('/treeimage/'+treeId)
        .success(function(url){
          imageStore[treeId] = url;
          cb(url);
        })
        .error(function(){
          console.log('Error getting tree image URL');
        });
      }
    };


    return  {
        loadTreeImage: loadTreeImage,
      };
  }
])

.factory('UserLikes', ['$http',
  function($http) {

    var getLikes = function(username, cb){
      var treeLikes = [];
      $http.post('/userlikes', {username: username})
      .success(function(data){
        data.forEach(function(treeLike){
          console.log(treeLike);
          if (treeLikes.indexOf(treeLike.name) === -1){
            treeLikes.push({
              name: treeLike.name,
              id:  treeLike.treeid,
              imgUrl: treeLike.url
            });
          }
        });
        cb(treeLikes);
      })
      .error(function(error){
        console.log('error getting userlikes');
      });
    };


    return {
      getLikes: getLikes,
    };
  }
])

/**
 * GetUserMessages factory to handle the routing to the server for getting user messages
 */
.factory('GetUserMessages', ['$resource', '$stateParams',
  function($resource, $stateParams) {
    return $resource('usermessages/:username', {
      treeid: '@_username'
    }, {
      get: {
        method: 'GET',
        isArray: true
      }
    });
  }
])

.factory('UserInfo', ['$http',
  function($http) {
    var get = function (username) {
      return $http({
        url: '/users/' + username,
        method: 'GET'
      });
    };

    var post = function (username, status) {
      return $http({
        url: '/users/' + username + '/status/',
        method:'POST',
        data: {status: status}
      });
    };

    return {
      get: get,
      post: post
    };
  }
]);

