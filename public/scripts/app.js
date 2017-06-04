var pQuoteTemplate = '<p class="the-quote"></p>';
var pAuthTemplate = '<p class="quote-author"></p>';
var timeTemplate = '<p class="quote-time"></p>';

     function checkUserAuth() {
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            
            user.getIdToken().then(function(accessToken) {
              document.getElementById('sign-in-status').textContent = 'Signed in';
              document.getElementById('sign-in').textContent = 'Sign out';
            
            });
          } else {
           
          }
        }, function(error) {
          console.log(error);
        });
      };

     $(window).on('load', function() {
  checkUserAuth();
});

firebase.initializeApp(taAppConfig);

function initDB() {
var database = firebase.database();
return database;
}

var db = initDB();

function writeUserData(author, message, db) {
  var newMessageKey = db.ref().child('quotes').push().key;

  var quoteData = {
    author: author,
    message: message,
    timestamp : new Date().getTime()
  };

  var updates = {};
  updates['/quotes/' + newMessageKey] = quoteData;

  return db.ref().update(updates);
};

//writeUserData('Aristotle', 'I drank what??', db);
/*
function doDisplayQuotes(db) {
var ref = db.ref().child('quotes');

ref.on('value', function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    var author = childSnapshot.val().author;
    var message = childSnapshot.val().message;
    console.log(message + ":" + author);

    // ...
  });
});

}*/

//doDisplayQuotes(db);

function doDisplayQuotes(db) {
//var ref = db.ref().child('quotes');
var ref = db;

ref.once('value', function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    var quoteObject = {};
    var author = childSnapshot.val().author;
    var message = childSnapshot.val().message;
    var timestamp = childSnapshot.val().timestamp;
    
  });
});

}
var db = initDB();

//doDisplayQuotes(db);

/*function()  {
$("#slideshow > div:gt(0)").hide();

setInterval(function() {
  $('#slideshow > div:first')
    .fadeOut(1000)
    .next()
    .fadeIn(1000)
    .end()
    .appendTo('#slideshow');
}, 3000);
}*/

function handleSubmit() {
    $('#quote-form').on('submit', (function(e) {
        e.preventDefault();
        var quote = $(this).find('#quote-text').val();
        var author = $(this).find('#quote-author').val();
        console.log(quote + " : " + author);
    }));
};


handleSubmit();