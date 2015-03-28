'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', '$rootScope', 'Global', 'Menus',
  function($scope, $rootScope, Global, Menus) {
    $scope.global = Global;
    $scope.menus = {};

    // Default hard coded menu items for main menu
    var defaultMainMenu = [];

    // Query menus added by modules. Only returns menus that user is allowed to see.
    function queryMenu(name, defaultMenu) {

      Menus.query({
        name: name,
        defaultMenu: defaultMenu
      }, function(menu) {
        $scope.menus[name] = menu;
      });
    }

    // Query server for menus and check permissions
    queryMenu('main', defaultMainMenu);
    queryMenu('account', []);


    $scope.isCollapsed = false;

    $rootScope.$on('loggedin', function() {

      queryMenu('main', defaultMainMenu);

      $scope.global = {
        authenticated: !! $rootScope.user,
        user: $rootScope.user
      };
    });

    $scope.chatToggle = false;
    $scope.chatPanelStatus = 'Show Chat';

    $scope.toggleChat = function (){
      if($scope.chatToggle){
        $scope.chatToggle = false;
        $scope.chatPanelStatus = 'Show Chat';

      } else {
        $scope.chatToggle = true;
        $scope.chatPanelStatus = 'Hide Chat';
      }
    };

  }
]).controller('ChatController', ['$scope', '$firebaseArray', 'Global', function($scope, $firebaseArray, Global){

  var ref = new Firebase('https://flickering-torch-2529.firebaseio.com/treeChat'); //jshint ignore:line

  $scope.messages = $firebaseArray(ref);

  var placeHolder = 'system/assets/img/placeholder.png';
  $scope.sendMessage = function(msg){
    Global.user.imageUrl = Global.user.imageUrl || placeHolder;
    $scope.messages.$add({
      from: Global.user,
      content: msg
    });

    $scope.msg = '';
  };

}]).filter('reverse', function(){
  return function(items){
    return items.slice().reverse();
  };
});
