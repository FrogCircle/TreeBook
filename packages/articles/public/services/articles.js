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
      console.log('stateParams', $stateParams.treeId);
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
    console.log('stateParams ', $stateParams);
    return $resource('usermessages', {}, {
      save: {
        method: 'POST'
        }
      });
    }
);



/*//Message factory for posting usermessage
angular.module('mean.articles')
  .factory('Messages',
  function($resource) {
    console.log('got inside func');
    return $resource('usermessages', {}, {
      save: {
        method: 'POST'
      }
    });
  }
);*/

//



