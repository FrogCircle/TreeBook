'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.articles').factory('Articles', ['$resource',
  function($resource) {
    return $resource('articles/1234', {
      articleId: '@_id'
    }, {
      update: {
        method: 'GET'
      }
    });
  }

]);
