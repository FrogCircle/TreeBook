'use strict';

// Articles service used for articles REST endpoint
angular.module('mean.articles')

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


// treeData service to provide tree data
.factory('TreeData', ['Trees', '$stateParams',
  function(Trees, $stateParams){
    // Save Tree to var
    var getTree = function(){
      return Trees
        .get({ treeId: $stateParams.treeId }, function(t){
          return t;
        });
    };

    return { getTree: getTree };
  }
])

// GetMessages factory for getting all messages related to a treeid
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

// GetUserMessages factory for getting all messages posted by a user
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

// Message factory for posting usermessage
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

// UserImage factory for persisting user photo
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

.factory('Likes', ['$http',
  function($http) {

    var getLikes = function(treeId, cb){
      var userLikes = [];
      $http.post('/treelikes', {treeId: treeId})
      .success(function(data){
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

    var saveLike = function(username, treeId, cb){
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
      getLikes: getLikes,
      saveLike: saveLike
    };
  }
]);


