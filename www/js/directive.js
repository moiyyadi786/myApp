angular.module('starter.directive',[])
.directive('ionSearch', function($ionicPopup, $ionicLoading, Books) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            books: '=',
            fetchBooks: '&'
            /*model: '=books',
            search: '=?filter'*/
        },
        link: function(scope, element, attrs) {
            attrs.minLength = attrs.minLength || 0;
            scope.placeholder = attrs.placeholder || '';
            scope.search = {value: ''};
            if (attrs.class)
              element.addClass(attrs.class);
                //scope.$watch('search.value', function (newValue, oldValue, scope) {
              scope.clearSearch = function() {
              scope.search.value = '';
              scope.searchBooks(scope.search.value);
             };
             scope.searchBooks = function(newValue){
                  $ionicLoading.show({
                      template: 'Loading...'
                  });
                  var searchBooks = Books.searchBooks(newValue);
                  searchBooks.success(
                    function(response){
                      scope.books = response;
                    }).error(
                    function(response){
                      $ionicLoading.hide();
                      $ionicPopup.alert({
                        title: 'Error',
                        template: 'Error Fetching data'
                        })
                    }).then(function(){
                    $ionicLoading.hide();
                 });
              }

        },
        template: '<div class="item-input-wrapper no-padd">' +            
                    '<input type="search" placeholder="{{placeholder}}" ng-model="search.value">' +
                    '<i ng-if="search.value.length > 0" ng-click="clearSearch()" class="icon ion-close"></i>' +
                    '<button class="button button-small col-offset-10 button-calm" ng-click="searchBooks(search.value)"><i class="icon ion-search pull-right"></i></button>' +
                  '</div>'
    };
})
.directive('ionBooksList', function(){
 return {
     restrict: 'E',
     replace: true,
     templateUrl: '/templates/listed-books.html',
     link: function(scope, element, attrs){
        scope.showBookDetails = function(id){
            
        }
     },
     scope: {
        books: '='
     }
 }
})
.directive('bookDetails', function($rootScope, $window, $ionicHistory, $ionicViewService, $ionicLoading, $ionicPopup, Messages){
  return {
    restrict: 'A',
    link: function(scope, element, attr){
        scope.$on("$stateChangeStart", function(){
          element.remove();
        });
        scope.goBack = function(){
         $window.history.back();
        }
        scope.getMessages = function(bookId){
          console.log(bookId);
          $ionicLoading.show({
          template: 'Loading...'
          });   
          Messages.getMessages(bookId)
          .then(
          function(response){
            scope.messages = response.data;
            scope.messageShown = true;
          },
          function(response){
            $ionicPopup.alert({
               title: 'Error',
               content: 'Sorry! Error occured sending message try again later'
            });
          }
          ).then(function(){
           scope.showMessage = false;
           $ionicLoading.hide();
          });         
        }
        scope.hideMessages = function(){
          scope.messages = [];
          scope.messageShown = false;
        }
      },
     controller: ['$scope', function($scope){
        this.deleteMessage = function(messageId){
        $ionicLoading.show({
          template: 'Loading...'
        });   
        Messages.deleteMessage(messageId)
        .then(
          function(response){
           $ionicPopup.alert({
               title: 'Success',
               content: 'Your message is deleted'
            });
           var i =0;
           $scope.messages.find(function(elem){
              if(elem.messageId == messageId){
              return true;
              }
              i++;
            });
           $scope.messages.splice(i, 1);
           $scope.messageCount = $scope.messages.length;
          },
          function(response){
            $ionicPopup.alert({
               title: 'Error',
               content: 'Sorry! Error occured sending message try again later'
            });
          }
        ).then(function(){
         $scope.showMessage = false;
         $ionicLoading.hide();
        });
        }
    }],
    }
})
.directive('placeNewOrder', function($rootScope, $window){
  return {
    restrict: 'A',
    link: function(scope, element, attr){
        scope.$on("$stateChangeStart", function(){
          element.remove();
        });
      }
    }
})
.directive('ionMessages', function($compile, $parse, $templateCache){
 return {
       restrict: 'E',
       require: ['^bookDetails'],
       //replace: true,
       templateUrl: '/templates/message-list.html',
       scope: {
          messages: '='
       },
      link: function (scope, element, attrs, ctrls) {        
        scope.deleteMessage= function(messageId) {
          ctrls[0].deleteMessage(messageId);
        }
      }
  }
});
    
