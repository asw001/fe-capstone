var authElem = '#firebaseui-auth-container';

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
    ],
    tosUrl: './tos.html' //terms of service URL. required
};

function doFireBaseUI(uiConfig, authElem) {
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start(authElem, uiConfig);
};

doFireBaseUI(uiConfig, authElem);