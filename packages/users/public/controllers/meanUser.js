'use strict';

angular.module('mean.users')

.factory('MeanUser', [

  function() {
    return {
      name: 'users'
    };
  }
])

/**
 * TreeImage factory to get the image of a tree id. Used on the user profile page
 * Status: not working - SQL doesn't return anything
 */
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


/**
 * UserLikes factory to get all likes for a user
 * Status: not working - SQL doesn't return anything
 */
.factory('UserLikes', ['$http',
  function($http) {

    var getLikes = function(username, cb){
      var treeLikes = [];
      $http.post('/userlikes', {username: username})
      .success(function(data){
        console.log(data);
        data.forEach(function(treeLike){
          if (treeLikes.indexOf(treeLike.treeName) === -1){
            treeLikes.push(treeLike.treeName);
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
]);
