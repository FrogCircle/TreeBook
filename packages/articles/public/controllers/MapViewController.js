'use strict';

/**
 * Controller that handle the map display, get the lat and lng data and
 * display the map on the profile.html
 * currently need maker to be added
 */
angular.module('mean.articles', ['uiGmapgoogle-maps', 'angularFileUpload'])

/**
 * Configure tha google map api
 */
.config(['uiGmapGoogleMapApiProvider', function(uiGmapGoogleMapApi){
  uiGmapGoogleMapApi.configure({
      //provide api key if available
      v: '3.18',
      libraries: 'geometry, visualization, places'
  });
}])

/**
 * MapView Controller to handle the MapView on ProfilePage
 */
.controller('MapViewController', ['$scope', '$q', 'uiGmapGoogleMapApi', 'TreeData', 'Search',
  function($scope, $q, uiGmapGoogleMapApi, TreeData, Search) {
    $scope.resolved = false;

    //Promise that retrive the near by tree data based on the location
    var searchNearTrees = function(center){
      $scope.nearTrees = [];
      return $q.when(center).then(function(center){
        Search.getNearTrees().get(center, function(results){
          for(var i = 0, size = results.length; i < size; i = i + 1){
            var tmp = {};
            tmp.id = i;
            tmp.coords = {latitude: results[i].latitude, longitude: results[i].longitude};
            tmp.options = { draggable: false };
            if(tmp.coords.latitude === center.latitude && tmp.coords.longitude === center.longitude){
              tmp.options = { animation: 1, draggable: false };
            }
            $scope.nearTrees.push(tmp);
          }
          console.log($scope.nearTrees);
        });
      });
    };

    // Promise assign the latitude and longitude to the $scope
    // $scope.resolved is used for the ng-if
    var onLoad = function(data){
      return $q.when(data).then(function(data){
        var mapCenter = {
          latitude: data.latitude,
          longitude: data.longitude
        };
        $scope.map = {center: mapCenter, zoom: 20 };
        searchNearTrees(mapCenter).then(function(){
          console.log('Get the near trees and markers');

          $scope.coordsUpdates = 0;
          $scope.dynamicMoveCtr = 0;

          //make the marker for the center tree
          $scope.marker = {
            id: 1,
            coords: mapCenter,
            options: {
              animation: 1,
              draggable: true
            }
          };

          //Changed to resolve once all data are loaded
          $scope.resolved = true;
        });
      });
    };

    //Load the tree
    TreeData.getTree().$promise.then(function(tree){
      onLoad(tree);
    });
  }
]);