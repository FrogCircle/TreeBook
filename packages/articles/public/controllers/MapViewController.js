'use strict';

angular.module('mean.articles', ['uiGmapgoogle-maps'])

.config('uiGmapGoogleMapApiProvider', function(uiGmapGoogleMapApi){
  uiGmapGoogleMapApi.configure({
    //api key
      v: '3.18',
      libraries: 'weather,geometry,visualization'
  });
})

.controller('MapViewController', function($scope, uiGmapGoogleMapApi) {
  $scope.map = {center: {latitude: 51.219053, longitude: 4.404418 }, zoom: 14 };
  $scope.options = {scrollwheel: false};

  //Async

  // uiGmapGoogleMapApi.then(function(maps) {

  // });
});
