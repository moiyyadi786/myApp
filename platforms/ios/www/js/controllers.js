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

.controller('AccountCtrl', function($scope, $state) {
  $scope.placeOrder = function(){
    $state.go('tab.placeneworder');
  };
})

/*.controller('BooksNeededCtrl', function($scope, $state){
})*/

.controller('PlaceNewOrderCtrl', function($scope, $window, $rootScope, Books,$ionicPopup){
   $scope.buy = false;
   $scope.sell = false;
   $scope.fields = {};
   $rootScope.$ionicGoBack = function(){
     //$state.go('tab.account');
     $window.location.href = "#/tab/account";
     $window.location.reload();
   },
   $scope.submit = function(){
     var data = $scope.fields;
     var post = Books.saveRequest(data);
     post.then(
         function(response){
           console.log(response);
           $ionicPopup.alert({
               title: 'Success',
               content: response.data.hi + ' has been posted!'
             });
         }
         /*function(response){
           $ionicPopup.alert({
               title: 'Success',
               content: data.bookName + ' has been posted!'
             });
         }*/
    );
   }
});
