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

.controller('AccountCtrl', function($scope, $state, Books, $ionicLoading) {
  var getMyBooks = Books.getMyBooks();
  $scope.mybooks = [];
  $ionicLoading.show({
      template: 'Loading...'
  });
  getMyBooks.then(
      function(response){
        $scope.mybooks = response.data;
      },
      function(reponse){
        $scope.mybooks = [{"bookName": "Harry Potter"}];
      }
  ).then(function(){
   $ionicLoading.hide();
  });
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
   $scope.submit = function(){
     var data = $scope.fields;
     var post = Books.saveRequest(data);
     post.then(
         function(response){
           $ionicPopup.alert({
               title: 'Success',
               content: response.data.bookName + ' has been posted!'
             }).then(function(res){
           $window.location.href = "#/tab/account";
           document.getElementById('place-new-request-element').remove();
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
})
.controller('BookDetailsCtrl', function($scope, $window, $rootScope, $stateParams, Books){
   var book = Books.getBookDetails($stateParams.id);
   console.log($scope.$element);
   book.then(
    function(response){
      $scope.book = response.data;
    }
   );
});



