'use strict';

/*
  Controller that handle the map display, get the lat and lng data and
  display the map on the profile.html
  currently need maker to be added
*/
angular.module('mean.articles', ['uiGmapgoogle-maps'])

//Configure tha google map api
.config(['uiGmapGoogleMapApiProvider', function(uiGmapGoogleMapApi){
  uiGmapGoogleMapApi.configure({
      //provide api key if available
      v: '3.18',
      libraries: 'geometry,visualization'
  });
}])

//set up the map view ctrl
.controller('MapViewController', ['$scope', 'uiGmapGoogleMapApi', 'treeData',
  function($scope, uiGmapGoogleMapApi, treeData) {
    $scope.resolved = false;
    treeData.promise.$promise.then(function(){
      var tree = treeData.getTree();
      var lat =  tree.latitude;
      var lon =  tree.longitude;
      console.log(lon,lat);
      $scope.map = {center: {latitude: 40.444597, longitude: '-79.945033'}, zoom: 14 };
      $scope.options = {scrollwheel: false};
      $scope.resolved = true;
    });
  }
]);