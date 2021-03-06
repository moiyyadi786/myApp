angular.module('starter.services', [])
.factory('Books', function($http, $q) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  /*var books = [{
    id: 0,
    name: 'Midnights Children',
    description: 'Author is Salman Rushdie',
    img: 'img/midnights-children.jpeg'
  },
  {
    id: 1,
    name: 'Harry Potter',
    description: 'Author is JK Rowling',
    img: 'img/harry-potter.jpeg'
  },
  {
    id: 2,
    name: 'A Fine Balance',
    description: 'Author is Rohinton Mistry',
    img: 'img/a-fine-balance.jpeg'
  }];*/

  return {
    all: function() {
      return books;
    },
    saveRequest: function(data){
      var post = $http({
        method: 'POST',
        url: '/api/book/save',
        data: data
      });
      return post;
    },
    getAllBooks: function(){
      var books = $http({
          method: 'GET',
          url: '/books'
      });
      return books;
    },
    searchBooks: function(searchString){
      var books =$http({
        method: 'GET',
        url: '/books?search='+searchString
      });
      return books;
    },
    getMyBooks: function(type){
      var deferred = $q.defer();
      var promise = deferred.promise;
      var books = $http({
          method: 'GET',
          url: '/api/mybooks?type='+type
      });
      books.then(
        function(response){
          if(response.data){        
          deferred.resolve(response.data);
          return;
          }
          deferred.reject(response);
        },
        function(response){
           deferred.reject(response);
        }
      );
      promise.success = function(fn) {
          promise.then(fn);
          return promise;
      }
      promise.error = function(fn) {
          promise.then(null, fn);
          return promise;
      }
      return promise;
    },
    getBookDetails: function(id){
     var book = $http({
          method: 'GET',
          url: '/api/book/'+id
      });
      return book;
    },
    addBookToUser: function(bookId, interestType){
      var bookUser = $http({
        method: 'POST',
        url: '/api/addbooktouser',
        data: {'bookId': bookId, 'interestType': interestType}
      });
      return bookUser;
    },
    /*remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }*/
  };
})
.factory('Messages', function($http, $q){
return {
    sendMessage: function(data){
      var message = $http({
        method: 'POST',
        url: '/api/message/send',
        data: data
      });
      return message;
    },
    getMessages: function(id){
     var messages = $http({
          method: 'GET',
          url: '/api/messages/book/'+id
      });
      return messages;
    },
    deleteMessage: function(id){
     var message = $http({
          method: 'DELETE',
          url: '/api/message/'+id
      });
      return message;      
    }
  }
})
.service('LoginService', function($q, $http, $window) {
    return {
        loginUser: function(username, password) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            var auth =  $http({
                method: 'POST',
                url: '/authenticate',
                data: {username: username, password: password}
            });

            auth.then(
              function(response){
                if(response.data.success){
                 $http.defaults.headers.common.Authorization = response.data.token;
                 $window.localStorage['jwtToken'] = response.data.token;
                 deferred.resolve('Welcome !');
                return;
                }
                deferred.reject('Wrong credentials.');
              },
              function(){
                 deferred.reject('Wrong credentials.');
              }
            );
            promise.sad = function(fn) {
                promise.then(null, fn);
            }
            promise.hurray = function(fn) {
                promise.then(fn);
                return promise;
            }

            return promise;
        },
        signUp: function(username, password, name){
            var deferred = $q.defer();
            var promise = deferred.promise;
            var auth =  $http({
                method: 'POST',
                url: '/signup',
                data: {username: username, password: password, name: name}
            });

            auth.then(
              function(response){
                 deferred.resolve('Welcome !');
                 $http.defaults.headers.common.Authorization = response.data.token;
                 $window.localStorage['jwtToken'] = response.data.token;
              },
              function(){
                 deferred.reject('Wrong credentials.');
              }
            );
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;      
        }
    }
});
