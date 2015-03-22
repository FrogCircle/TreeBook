'use strict';
/*
  Factory that handle the address search in the list.html
*/
angular.module('mean.articles')
/*
  Factory that handle the search in the list.html
*/
.factory('Search', ['$resource', 'uiGmapGoogleMapApi',
  function($resource, uiGmapGoogleMapApi){
    /*
      Take the address as params and return the location(lat, lng)
      should remember check the validation of the input somewhere
      @params string target
      @result
    */
    var getLocation = function(target) {
      return uiGmapGoogleMapApi.then(function(maps){
        var geocoder = new maps.Geocoder();
        var request = { address: target };
        geocoder.geocode(request, function(results, status){
          // location is found
          if (status === maps.GeocoderStatus.OK) {
            console.log(results[0].geometry.location);
            var location = results[0].geometry.location;
            return location;
          } else {
            console.log('No Valid Address Found: ' + status);
          }
        });
      });
    };

    var getNearTrees = function(target) {
      return $resource('/searchbyloc/:location',
      { search: '@_location' },
      {
        get:{
          method: 'GET',
          isArray: true
        }
      });
    };

    var getByName = function(target) {
      return $resource('/searchbyname/:search',
      { search: '@_search' },
      {
        get:{
          method: 'GET',
          isArray: true
        }
      });
    };

    return {
      getLocation: getLocation,
      getNearTree: getNearTree,
      getByName: getByName
    };
  }
]);