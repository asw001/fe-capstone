var myIDPoolID = 'us-east-1:e19c5230-c6da-4856-9fc0-9d04242948f0';
AWS.config.region = 'us-east-1';

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail());   // This is null if the 'email' scope is not present.
  // The ID token you need to pass to your backend:
  var id_token = googleUser.getAuthResponse().id_token;
  console.log("ID Token: " + id_token);

  signinCallback(id_token;
};

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
  console.log('User signed out.');
   });
};

$(function() {

$('div.nav-bar').on('click', 'button#sign-out', ( function(event) {
  event.preventDefault();
  signOut();
  }));
});

/*function signinCallback(authResult) {
  if (authResult['status']['signed_in']) {

     // Add the Google access token to the Cognito credentials login map.
     AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: myIDPoolID,
        Logins: {
           'accounts.google.com': authResult['id_token']
        }
     });

     // Obtain AWS credentials
     AWS.config.credentials.get(function(){
        // Access AWS resources here.
     });
  }
}*/

function signinCallback(id_token) {
  if (id_token) {
     console.log('we are signed in');
     // Add the Google access token to the Cognito credentials login map.
     AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: myIDPoolID,
        Logins: {
           'accounts.google.com': id_token
        }
     });

     // Obtain AWS credentials
     //AWS.config.credentials.get(function(){
        // Access AWS resources here.
    // };
  }
  else {
  	console.log('no auth');
  }
};

