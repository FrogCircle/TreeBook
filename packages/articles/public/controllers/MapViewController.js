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
      libraries: 'geometry, visualization, places'
  });
}])

//set up the map view ctrl
.controller('MapViewController', ['$scope', '$q', 'uiGmapGoogleMapApi', 'treeData',
  function($scope, $q, uiGmapGoogleMapApi, treeData) {
    $scope.resolved = false;

    var onLoad = function(data){
      return $q.when(data).then(function(data){
        console.log(data);
        var mapCenter = {
          latitude: data.longitude,
          longitude: data.latitude
        };
        console.log(mapCenter);
        $scope.map = {center: mapCenter, zoom: 14 };
        $scope.resolved = true;
        console.log($scope.map);
      });
    };

    treeData.getTree().$promise.then(function(tree){
      onLoad(tree);
    });

    uiGmapGoogleMapApi.then(function(maps){
      console.log(maps);
    });
  }
]);