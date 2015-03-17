'use strict';

angular.module('mean.articles', ['uiGmapgoogle-maps'])

.controller('TreeSearchController', ['$scope', 'GeoCode',
  function($scope, GeoCode){
    var requestAddress = $scope.address;
    var location = GeoCode.getLocation(requestAddress);
    console.log(location);
  }
]);