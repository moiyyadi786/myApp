angular.module('starter.services', [])
.factory('Books', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var books = [{
    id: 0,
    name: 'Midnights Children',
    description: 'Author is Salman Rushdie'
  },
  {
    id: 1,
    name: 'Harry Potter',
    description: 'Author is JK Rowling'
  },
  {
    id: 2,
    name: 'A Fine Balance',
    description: 'Author is Rohinton Mistry'
  }];

  return {
    all: function() {
      return books;
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
