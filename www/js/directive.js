angular.module('starter.directive',[])
.directive('ionSearch', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            getData: '&source',
            model: '=?',
            search: '=?filter'
        },
        link: function(scope, element, attrs) {
            attrs.minLength = attrs.minLength || 0;
            scope.placeholder = attrs.placeholder || '';
            scope.search = {value: ''};

            if (attrs.class)
                element.addClass(attrs.class);

            if (attrs.source) {
                scope.$watch('search.value', function (newValue, oldValue) {
                    if (newValue.length > attrs.minLength) {
                        scope.getData({str: newValue}).then(function (results) {
                            scope.model = results;
                        });
                    } else {
                        scope.model = [];
                    }
                });
            }

            scope.clearSearch = function() {
                scope.search.value = '';
            };
        },
        template: '<div class="item-input-wrapper">' +
                    '<i class="icon ion-android-search"></i>' +
                    '<input type="search" placeholder="{{placeholder}}" ng-model="search.value">' +
                    '<i ng-if="search.value.length > 0" ng-click="clearSearch()" class="icon ion-close"></i>' +
                  '</div>'
    };
})
.directive('ionBooksList', function(){
 return {
     restrict: 'E',
     templateUrl: '/templates/my-listed-books.html',
     link: function(scope, element, attrs){
        scope.showBookDetails = function(id){
            
        }
     },
     scope: {
        mybooks: '=',
     }
 }
})
.directive('bookDetails', function($rootScope, $window){
  return {
    restrict: 'A',
    link: function(scope, element, attr){
        $rootScope.$ionicGoBack = function(){
         //$state.go('tab.account');
         $window.location.href = "#/tab/account";
         element.remove();
         //
         }
      }
    }
})
.directive('placeNewOrder', function($rootScope, $window){
  return {
    restrict: 'A',
    link: function(scope, element, attr){
        $rootScope.$ionicGoBack = function(){
         //$state.go('tab.account');
         $window.location.href = "#/tab/account";
         element.remove();
         //
         }
      }
    }
});
    
