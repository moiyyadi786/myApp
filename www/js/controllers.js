angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state, $window) {
    $scope.data = {};
    $scope.goBack = function(){
      $state.go('tab.dash');
    }
    $scope.login = function() {
        LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
            //$state.go('tab.account');
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
            $state.go('tab.dash');
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
    }
})

.controller('DashCtrl', function($scope, Books, $ionicLoading, $ionicPopup) {
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

.controller('AccountCtrl', function($scope, $state, Books, $ionicLoading) {
  var getMyBooks = Books.getMyBooks();
  $scope.books = [];
  $ionicLoading.show({
      template: 'Loading...'
  });
  getMyBooks.then(
      function(data){
        $scope.books = data;
      },
      function(response){
        //$scope.mybooks = [{"bookName": "Harry Potter"}];
        if(response.status == 403){
          $state.go('login');
        }
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
   /*$scope.takePhoto = function () {
            $ionicScrollDelegate.scrollTop();
            console.log('fired camera');
            $scope.uploadList = false;
            $ionicPlatform.ready(function() {
                var options = {
                    quality: 100,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    allowEdit: false,
                    encodingType: Camera.EncodingType.PNG,
                    targetWidth: 800,
                    targetHeight: 1100,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                };
                $cordovaCamera.getPicture(options).then(function (imageData) {
                    $ionicLoading.show({
                        template: 'Processing Image',
                        duration: 2000
                    });
                    $scope.image = "data:image/png;base64," + imageData;
                    if (ionic.Platform.isAndroid() === true) {
                        $scope.Data.Image = LZString.compressToUTF16($scope.image);
                        $scope.Data.isCompressed = 1;
                    } else {
                        $scope.Data.Image = $scope.image;
                        $scope.Data.isCompressed = 0;
                    }
                    if ($scope.tutorial) {
                        $scope.showAlert("Instructions: Step 3", '<div class="center">Now that you have taken a photo of the POD form, you must upload it to the server. Press the upload doc button in the bottom right of the screen.</div>');
                    }
                    $scope.on('')
                }, function (err) {
                    console.log(err);
                });
            }, false);
        };

   $scope.UploadDoc = function () {
            var req = {
                method: 'POST',
                url: ffService.baseUrlAuth + 'cc/upload',
                headers: {
                    'x-access-token': ffService.token
                },
                data: $scope.Data
            };
            if ($scope.Data.Image === null || $scope.Data.Value === '') {
                $scope.showAlert("Uh Oh!", '<div class="center">Please take a photo of your document before attempting an upload.</div>');
            } else {
                $http(req).success(function (data, status, headers, config) {
                    localStorage.setItem('tutorial', false);
                    $scope.tutorial = false;
                    $scope.getUploads($scope.PODOrder.OrderNo);
                    $scope.showAlert("Success!", '<div class="center">Your Document has been successfully uploaded!</div>');
                    $scope.uploadList = true;
                }).error(function (data, status, headers, config) {
                    $rootScope.$broadcast('loading:hide');
                    $scope.showAlert("Something went wrong!", '<div class="center">Please make sure you have an internet connection and try again.</div>');
                }).then(function(data, status, headers, config){
                    $scope.Data.Image = null;
                });
            }
    };*/
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
.controller('BookDetailsCtrl', function($scope, $state,$window, $rootScope, $stateParams, Books){
   var book = Books.getBookDetails($stateParams.id);
   book.then(
    function(response){
      $scope.book = response.data[0];
      $scope.isInterested = response.data[1];
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
   },
   $scope.goBack = function(){
     $window.history.back();
     element.remove();
   }
});



