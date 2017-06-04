var divTemplate = '<div class="quote-div"/></div>';
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

//firebase.initializeApp(taAppConfig);

function initDB() {
  var database = firebase.database().ref().child('quotes');
  return database;
}

function writeUserData(author, message, db) {
  //var newMessageKey = db.ref().child('quotes').push().key;
  var newMessageKey = db.push().key;
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

function doDisplayQuotes(db) {
//var ref = db.ref().child('quotes');
var ref = db;

ref.once('value', function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    var quoteObject = {};
    var author = childSnapshot.val().author;
    var message = childSnapshot.val().message;
    var timestamp = childSnapshot.val().timestamp;
    //quoteObject.message = message;
    //quoteObject.author = author;
    //quotes.push(quoteObject);
    //console.log(message + ":" + author);

    // ...
  });
});

}
var db = initDB();
var quotes = [];

doDisplayQuotes(db);


function()  {
$("#slideshow > div:gt(0)").hide();

setInterval(function() {
  $('#slideshow > div:first')
    .fadeOut(1000)
    .next()
    .fadeIn(1000)
    .end()
    .appendTo('#slideshow');
}, 3000);
}