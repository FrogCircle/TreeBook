'use strict';

angular.module('mean.articles', ['uiGmapgoogle-maps'])

//Configure tha google map api
.config(['uiGmapGoogleMapApiProvider', function(uiGmapGoogleMapApi){
  uiGmapGoogleMapApi.configure({
      //provide api key if available
      v: '3.18',
      libraries: 'weather,geometry,visualization'
  });
}])

//set up the map view ctrl
.controller('MapViewController', ['$scope', 'uiGmapGoogleMapApi',
  function($scope, uiGmapGoogleMapApi) {
    //Dumb node set up
    $scope.map = {center: {latitude: 51.219053, longitude: 4.404418 }, zoom: 14 };
    $scope.options = {scrollwheel: false};

    //Async call can be done here if needed

    // uiGmapGoogleMapApi.then(function(maps) {

    // });
  }
]);
