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
.directive('bookDetails', function($rootScope, $window, $ionicHistory, $ionicViewService){
  return {
    restrict: 'A',
    link: function(scope, element, attr){
        scope.$on("$stateChangeStart", function(){
          element.remove();
        });
        scope.goBack = function(){
         $window.history.back();
        }
      }
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
});
    
