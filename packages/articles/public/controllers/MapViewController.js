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

    var searchNearTrees = function(center){
      $scope.nearTrees = [];
      return $q.when(center).then(function(center){
        Search.getNearTrees().get(center, function(results){
          for(var i = 0, size = results.length; i < size; i = i + 1){
            var tmp = {};
            tmp.id = results[i].treeid;
            tmp.coords = {latitude: results[i].latitude, longitude: results[i].longitude};
            $scope.nearTrees.push(tmp);
          }
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

        //There is a little bug here, when the map is moving, the marker will
        //move as well. I spot this bug but fix it need a little bit time, so
        //I skip it first as it is not very important.
        $scope.coordsUpdates = 0;
        $scope.dynamicMoveCtr = 0;

        $scope.marker = {
          id: 1,
          coords: mapCenter,
          options: {
            animation: 1,
            draggable: true
          }
        };
        $scope.resolved = true;
        searchNearTrees(mapCenter)
      });
    };

    TreeData.getTree().$promise.then(function(tree){
      onLoad(tree);
    });
    // var tree = TreeData.returnTree();
    // onLoad(tree);
  }
]);