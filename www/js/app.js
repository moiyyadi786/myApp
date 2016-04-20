// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
  'ionic',
  'angular-jwt',
  'starter.controllers', 
  'starter.services', 
  'starter.directive'])

.run(function($ionicPlatform, $window, $http, jwtHelper) {
  if($window.localStorage['jwtToken']){
  $http.defaults.headers.common.Authorization = $window.localStorage['jwtToken'];
  //console.log(jwtHelper.decodeToken($window.localStorage['jwtToken']));
  }  
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
  })
  .state('signup',{
      url: '/signup',
      templateUrl: 'templates/sign-up.html',
      controller: 'LoginCtrl'
  })

  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.search', {
      url: '/search',
      views: {
        'tab-search': {
          templateUrl: 'templates/tab-search.html',
          controller: 'SearchCtrl'
        }
      }
    })
  /*  .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })*/

  .state('tab.account', {
    url: '/account',
    cache: false,
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  .state('tab.account.booksneeded', {
    url: '/booksneeded',
    views: {
      'books-needed': {
        templateUrl: 'templates/books-needed.html',
        controller: 'BooksNeededCtrl'
      }
    }
  })

  .state('tab.placeneworder',{
    url: '/placeneworder',
    views: {
        'place-new-order':{
          templateUrl: 'templates/place-new-order.html',
          controller: 'PlaceNewOrderCtrl'
        }
    }
  })
  .state('bookdetails',{
    url: '/bookdetails/:id',
    views: {
        'book-details':{
          templateUrl: 'templates/book-details.html',
          controller: 'BookDetailsCtrl'
        }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

})
.config(['$ionicConfigProvider', function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom'); // other values: top
    $ionicConfigProvider.navBar.alignTitle('middle')

}])
.config(['$ionicConfigProvider', function($ionicConfigProvider) {
  $ionicConfigProvider.platform.ios.navBar.alignTitle('left');
  $ionicConfigProvider.backButton.text('').icon('ion-chevron-left').previousTitleText(false);
 }]);
