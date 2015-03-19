'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.articles').factory('Articles', ['$resource',
  function($resource) {
    return $resource('articles/:treeId', {
      treeId: '@_id'
    }, {
      update: {
        method: 'GET'
      }
    });
  }
]);
//GetMessages factory for getting all messages related to a treeid
angular.module('mean.articles')
  .factory('GetMessages', ['$resource', '$stateParams',
    function($resource, $stateParams) {
      return $resource('treemessages/:treeid', {
        treeid: '@_treeid'
      }, {
        get: {
          method: 'GET',
          isArray: true
        }
      });
    }
  ]);
//Message factory for posting usermessage
angular.module('mean.articles')
  .factory('Messages',
  function($resource, $stateParams) {
    return $resource('usermessages', {}, {
      save: {
        method: 'POST',
        isArray: true
      }
    });
  }
);
//UserImage factory for persisting user photo
angular.module('mean.articles')
  .factory('UserImage',
  function($resource, $stateParams) {
    var alreadyLoadedNewImage = false;
    var newUrl;
    var loadUserImage = function(url) {
      if (url) {
        url = url.split('packages/theme/public/assets/img');
        newUrl = 'theme/assets/img' + url[1];
        alreadyLoadedNewImage = true;
        return newUrl;
      } else if(alreadyLoadedNewImage) {
        return newUrl;
      } else {
        return 'theme/assets/img/icons/user-icon.png';
      }
    };
    return  {
      loadUserImage: loadUserImage
      }
  }
);



