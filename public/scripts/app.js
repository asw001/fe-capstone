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
  //var newMessageKey = db.push().key;
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

/*function hideAuthorErrorInput() {
$('div.error-author-submit').hide();
   }*/

/*function showAuthorErrorInput() {
$('div.error-author-submit').show();
   }*/

function hideQuoteErrorInput() {
$('div.error-quote-submit').hide();
  }

function showQuoteErrorInput() {
$('div.error-quote-submit').show();
  }

function hideSubmitSuccess() {
$('div.submit-success').hide();
}  

function showSubmitSuccess() {
$('div.submit-success').show();
}


function handleSubmit() {
  hideQuoteErrorInput();
  hideSubmitSuccess();

    $('#quote-form').on('submit', (function(e) {
    /*  $('#quote-form').submit(function(e) {*/
        e.preventDefault();
        var quote = $(this).find('#quote-text').val();
        var author = $(this).find('#quote-author').val();
        quote = quote.replace(/[\n\r]+/g, ' ');
        author = author.replace(/[\n\r]+/g, ' ');
        console.log(quote + " : " + author);
        if (quote.length > 500) {
        showQuoteErrorInput(); 
        }
        else { 
        writeUserData(quote, author, db);
        $(this).find('#quote-text').val('');
        $(this).find('#quote-author').val('');
        hideQuoteErrorInput();
        showSubmitSuccess();
        }
        
    }));
};


handleSubmit();