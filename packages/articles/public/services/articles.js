'use strict';

/**
 * In this file there are numerous factories that are used to connect the controllers in public to the server.
 * These factories are used by the controllers and usually get picked up by the server in server/routes/articles.js
 * TODO: consolidate factories. For example we have 2 facotiries for messages (get and post), when ideally that would
 * be 1.
 */


angular.module('mean.articles')

/**
 * Trees factory to handle the routing to the server for basic tree requests
 */
.factory('Trees', ['$resource',
  function($resource) {
    return $resource('articles/:treeId', {
      treeId: '@_id'
    }, {
      update: {
        method: 'GET'
      }
    });
  }
])

/**
 * TreeData factory to expose the getTree method which gets tree data using Trees factory
 * There is a redundancy in this method as it is called by MapViewController and TreesController, both of which init a request
 */
.factory('TreeData', ['Trees', '$stateParams',
  function(Trees, $stateParams){
    var getTree = function(){
      return Trees
        .get({ treeId: $stateParams.treeId }, function(t){
          return t;
        });
    };

    return { getTree: getTree };
  }
])

/**
 * GetMessages factory to handle the routing to the server for basic message requests
 */
.factory('GetMessages', ['$resource', '$stateParams', 'Global',
  function($resource, $stateParams, Global) {
    return $resource('treemessages/:treeid', {
      treeid: '@_treeid'
    }, {
      get: {
        method: 'GET',
        isArray: true
      }
    });
  }
])

/**
 * Messages factory to handle the posting of messages to the server
 */
.factory('Messages',
  function($resource, $stateParams) {
    return $resource('usermessages', {}, {
      save: {
        method: 'POST',
        isArray: true
      }
    });
  }
)

/**
 * User Image factory to get images for usernames. Uses data storage to avoid redundant server calls
 */
.factory('UserImage', ['$http',
  function($http, $stateParams) {
    var imageStore = {};

    var loadUserImage = function(username, cb) {
      if (imageStore[username]){
        cb(imageStore[username]);
      } else {
        $http.get('/userimage/'+username)
        .success(function(url){
          imageStore[username] = url;
          cb(url);
        })
        .error(function(){
          console.log('Error getting user image URL');
        });
      }
    };

    var saveUserImage = function(user, url) {
      $http.post('/userimage', {username: user, imageUrl: url}).
        success(function(data) {
          console.log('success saving image in mongo db');
        }).
        error(function() {
          console.log('there was an error');
        });
    };
    return  {
      loadUserImage: loadUserImage,
      saveUserImage: saveUserImage
      };
  }
])

/**
 * Likes factory to handle the
 */
.factory('Likes', ['$http',
  function($http) {

    /**
     * getLikes function to get user likes uses storage to avoid multiple likes
     * Ideally that redundancy would be handled in SQL.
     */
    var getLikes = function(treeId, cb){
      // The callback here is to asynchronously save this data to the necissary $scope
      var userLikes = [];
      $http.post('/treelikes', {treeId: treeId})
      .success(function(data){
        // iterating through to find redundant user likes. 1 user can like a tree multiple times,
        // but it should only show once on the page.
        data.forEach(function(userLike){
          if (userLikes.indexOf(userLike.username) === -1){
            userLikes.push(userLike.username);
          }
        });
        cb(userLikes);
      })
      .error(function(error){
        console.log('error while saving like');
      });
    };


    /**
     * saveLike function to handle the posting of likes to the server
     */
    var saveLike = function(username, treeId, cb){
      // the callback is to asynchronously call getLikes in the controller
      $http.post('/treelike', {username: username, treeId: treeId})
      .success(function(data){
        console.log('success saving like');
        cb();
      })
      .error(function(error){
        console.log('error while saving like');
      });
    };

    return {
      // exposing the functions to the controllers.
      getLikes: getLikes,
      saveLike: saveLike
    };
  }
]);

