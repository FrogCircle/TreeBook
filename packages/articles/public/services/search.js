'use strict';
/*
  Factory that handle the address search in the list.html
*/
angular.module('mean.articles')
/*
  Factory that handle the search in the list.html
*/
.factory('Search', ['$resource', '$q', 'uiGmapGoogleMapApi',
  function($resource, $q, uiGmapGoogleMapApi){
    /*
      Take the address as params and return the location(lat, lng)
      should remember check the validation of the input somewhere
      @params string target
      @result
    */
    var getLocation = function(target) {
      console.log('get Location async');
      //this function need to be an async, so &q is used
      return $q(function(resolve, reject){
        uiGmapGoogleMapApi.then(function(maps){
          var geocoder = new maps.Geocoder();
          var request = { address: target };
          geocoder.geocode(request, function(results, status){
            // location is found
            if (status === maps.GeocoderStatus.OK) {
              var location = results[0].geometry.location;
              resolve(location);
            } else {
              console.log('No Valid Address Found: ' + status);
              reject(status);
            }
          });
        });
      });
    };

    /*
      Get the nearby trees using the service
    */
    var getNearTrees = function(queryObj) {
      return $resource('/searchbyloc', { lat: '@latitude', lng: '@longitude'},
      {
        get:{
          method: 'GET',
          isArray: true
        }
      });
    };

    /*
      Get the trees using the service through the name, id or species
      search should support both clear and vague string
    */
    var getByName = function(queryObj) {
      return $resource('/searchbyname/:search', {search: '@search'},
      {
        get:{
          method: 'GET',
          isArray: true
        }
      });
    };

    return {
      getLocation: getLocation,
      getNearTrees: getNearTrees,
      getByName: getByName
    };
  }
]);