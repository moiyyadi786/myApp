angular.module('starter.services', [])
.factory('Books', function($http) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var books = [{
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
  }];

  return {
    all: function() {
      return books;
    },
    saveRequest: function(data){
      var post = $http({
        method: 'POST',
        url: 'http://localhost:8100/book/save',
        data: data
      });
      return post;
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
});
