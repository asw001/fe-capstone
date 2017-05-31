      function checkUserAuth() {
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            
            user.getIdToken().then(function(accessToken) {
              document.getElementById('sign-in-status').textContent = 'Signed in';
              document.getElementById('sign-in').textContent = 'Sign out';
            
            });
          } else {
            // User is signed out.
            /*document.getElementById('sign-in-status').textContent = 'Signed out';
            document.getElementById('sign-in').textContent = 'Sign in';
            document.getElementById('account-details').textContent = 'null';*/
          }
        }, function(error) {
          console.log(error);
        });
      };

     $(window).on('load', function() {
  checkUserAuth();
});

  firebase.initializeApp(taAppConfig);

       var database = firebase.database();


function writeUserData(author, message) {
  var newMessageKey = firebase.database().ref().child('quotes').push().key;

  var quoteData = {
    author: author,
    message: message,
    timestamp : new Date().getTime()
  };

  var updates = {};
  updates['/quotes/' + newMessageKey] = quoteData;

  return firebase.database().ref().update(updates);
};

var ref = firebase.database().ref().child('quotes');

ref.once('value', function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    var author = childSnapshot.val().author;
    var message = childSnapshot.val().message;
    console.log(message + ":" + author);

    // ...
  });
});
