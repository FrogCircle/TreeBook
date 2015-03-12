'use strict';

angular.module('mean.articles', ['uiGmapgoogle-maps'])

.config(function(uiGmapGoogleMapApiProvider)
  uiGmapGoogleMapApiProvider.configure({
    //api key
      v: '3.18',
      libraries: 'weather,geometry,visualization'
  })
)

.controller('MapViewController', function($scope) {
  $scope.map = {center: {latitude: 51.219053, longitude: 4.404418 }, zoom: 14 };
  $scope.options = {scrollwheel: false};

  //Async
});
