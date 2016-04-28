angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state, $window, jwtHelper) {
    $scope.data = {};
    $scope.goBack = function(){
      $state.go('tab.dash');
    }
    $scope.login = function() {
        LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
            //$state.go('tab.account');
            user = jwtHelper.decodeToken($window.localStorage['jwtToken']);
            $window.history.back(-1);
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
    }
    $scope.signUp = function(){
      LoginService.signUp($scope.data.username, $scope.data.password, $scope.data.name).success(function(data) {
            user = jwtHelper.decodeToken($window.localStorage['jwtToken']);
            $state.go('tab.dash');
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
    }
})

.controller('DashCtrl', function($state, $scope, Books, $ionicLoading, $ionicPopup, $ionicHistory) {
  $scope.books = [];
  $ionicLoading.show({
      template: 'Loading...'
  });
  $scope.fetchBooks = function(){
    $scope.getAllBooks = Books.getAllBooks();
    $scope.getAllBooks.then(
      function(response){
        $scope.books = response.data;
      },
      function(response){
        $ionicPopup.alert({
           title: 'Error',
           content: 'Sorry! Error fetching data from server'
        });
      }
  ).then(function(){
   $ionicLoading.hide(); 

  });
 };
 $scope.fetchBooks();
})

.controller('SearchCtrl', function($scope) {
    // TODO search action
})

/*.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})*/

.controller('AccountCtrl', function($scope, $state, Books, $ionicLoading,$ionicHistory, $rootScope) {
  $scope.books = [];
  //$ionicHistory.clearHistory(); 
  $scope.fetchBooks = function(type){
    $rootScope.currentAccountView = type;
    if(type =='postings'){
      $scope.isPostings = "active";
      $scope.isInterested = "";
    } else {
      $scope.isPostings = "";
      $scope.isInterested = "active";
    }
    var getMyBooks = Books.getMyBooks(type);
    $ionicLoading.show({
        template: 'Loading...'
    });
    getMyBooks.then(
        function(data){
          $scope.books = data;
        },
        function(response){ 
          if(response.status == 403){
            $state.go('login');
          }
        }
    ).then(function(){
     $ionicLoading.hide();
    });
  }
  if(!$rootScope.currentAccountView){
    $rootScope.currentAccountView = 'postings';
  }
  $scope.fetchBooks($rootScope.currentAccountView);
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
    );
   }
})
.controller('BookDetailsCtrl', function($scope, $state,$window, $rootScope, $stateParams, Books, $ionicHistory){
   var book = Books.getBookDetails($stateParams.id);
   book.then(
    function(response){
      $scope.book = response.data[0];
      $scope.isInterested = response.data[1];
      $scope.isPostedByMe = user.userId == response.data[0].postedBy.userId;
      if($scope.isPostedByMe){
        $scope.isMe = "Me";
      }
    },
    function(response){
      if(response.status == 403){
        $window.location = "/#/login";
        $window.location.reload();
      }
    }
   );
   $scope.addBook = function(bookId, interestType){
    Books.addBookToUser(bookId, interestType)
    .then(
    function(response){
      $scope.isInterested = true;
    },
    function(response){
      if(response.status == 403){
        $window.location = "/#/login";
        $window.location.reload();
      }
    }
    );
   }
});



