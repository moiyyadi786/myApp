angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Books) {
    $scope.books = Books.all();
})

.controller('SearchCtrl', function($scope) {
    // TODO search action
})

/*.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})*/

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
