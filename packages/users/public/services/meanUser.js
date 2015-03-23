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
]);