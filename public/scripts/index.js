var authElem = '#firebaseui-auth-container';

taAppConfig = {
  apiKey: "AIzaSyDiEhP9ppjeKFrWYj1PcsJhlLmO_Nq9Huk",
  authDomain: "thinkful-fe-cs-asw.firebaseapp.com",
  databaseURL: "https://thinkful-fe-cs-asw.firebaseio.com",
};

function doFireBaseInit() {
    firebase.initializeApp(taAppConfig);
    try {
        let app = firebase.app();
        let features = ['auth', 'database', ].filter(feature => typeof app[feature] === 'function');
    } catch (e) {
        console.error(e);
    }
};
// FirebaseUI config.
var uiConfig = {
    signInSuccessUrl: './app.html',
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    tosUrl: './tos.html' //terms of service URL. required
};

function doFireBaseUI(uiConfig, authElem) {
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start(authElem, uiConfig);
};

doFireBaseUI(uiConfig, authElem);
