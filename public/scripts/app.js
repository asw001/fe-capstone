
(function () {

//DOM manipulation functions
function hideQuoteErrorInput() {
    $('#error-quote-submit').hide();
}

function showQuoteErrorInput() {
    $('#error-quote-submit').show();
}

function hideSubmitSuccess() {
    $('#submit-success').hide();
}

function showSubmitSuccess() {
    $('#submit-success').show();
    $('#submit-success').fadeOut(3000);
}

function showSubmitForm() {
    $('#quote-submit').show();
}

function hideSubmitForm() {
    $('#quote-submit').hide();
}

function hideFormAccess() {
    $('#form-access').hide();
}

function handleFormReveal() {
  $("#form-access").on('click', 'span', function(event) {
    event.stopPropagation();
    showSubmitForm();
    hideFormAccess();
  });
};

//calls Firebase library to verify user auth
//displays status on page, logs auth errors to console. https://github.com/firebase/firebaseui-web
function checkUserAuth() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            user.getIdToken().then(function(accessToken) {
                //document.getElementById('sign-in-status').textContent = 'Signed in';
            });
        } else {
                document.getElementById('sign-in-status').textContent = 'Not signed in';
        }
    }, function(error) {
        console.log(error);
    });
};

//instantiates the database object
function initDB() {
    var database = firebase.database();
    return database;
};

function writeUserData(quote, author, db) {
    var newQuoteKey = db.ref().child('quotes').push().key; //get a UUID for the database record
    var quoteData = {                                        
        quote: quote,
        author: author,
        timestamp: new Date().getTime(),
    };
    var updates = {};
    updates['/quotes/' + newQuoteKey] = quoteData;

    return db.ref().update(updates); //returns a promise; otherwise need error handling here
};

function renderQuotes(renderConfig) { //renderConfig stored in config.js
    var elemQuoteDiv = $(renderConfig.quoteDivTemplate);
    var elemAuthor = $(renderConfig.authorTemplate);
    var elemSlide = $(renderConfig.slideDiv);
    var elemSlideChild = $(renderConfig.slideChildDiv);
    renderConfig.author = '-- ' + renderConfig.author;

    elemQuoteDiv.append(renderConfig.quote);
    elemAuthor.append(renderConfig.author);
    elemSlideChild.append(elemQuoteDiv);
    elemSlideChild.append(elemAuthor);
    elemSlide.append(elemSlideChild);
};

function doDisplayQuotes(db, renderConfig) {
    var ref = db.ref().child('quotes');
    $('#slideshow').empty(); //if we don't empty the parents div, duplicate child entries will be created

    ref.once('value', function(snapshot) { //the once method creates a connection to db, then removes listener; this
        snapshot.forEach(function(childSnapshot) { //essentially disables the realtime capability of the DB
            renderConfig.quote = childSnapshot.val().quote; //https://firebase.google.com/docs/database/web/read-and-write
            renderConfig.author = childSnapshot.val().author;
            renderQuotes(renderConfig);
        });
    });
};

function handleSubmit() {
    hideQuoteErrorInput();
    hideSubmitSuccess();
    $('#quote-form').on('submit', (function(event) {
        event.preventDefault();
        event.stopPropagation();
        var quote = $(this).find('#quote-text').val();
        var author = $(this).find('#quote-author').val();
        quote = quote.replace(/[\n\r]+/g, ' '); //remove newline chars
        author = author.replace(/[\n\r]+/g, ' ');

        if (quote.length > 600) {
            showQuoteErrorInput();
        } else {
            writeUserData(quote, author, db);
            $(this).find('#quote-text').val('');
            $(this).find('#quote-author').val('');
            hideQuoteErrorInput();
            showSubmitSuccess();
            doDisplayQuotes(db, renderConfig);//rebuild the quotes in parent DIV
            hideSubmitForm();
        }
    }));
};

function doSlideShow() {
    $("#slideshow > div:first").show(); //ensures that, in conjunction with child divs being created
                                        //with display none, the child divs are not all rendered at once
    setInterval(function() {            //on top of one another
        $('#slideshow > div:first')
            .fadeOut(1000)
            .next()
            .fadeIn(1000)
            .end()
            .appendTo('#slideshow');
    }, 6000);
};


firebase.initializeApp(taAppConfig);

$(window).on('load', function() {
    checkUserAuth();
});

hideSubmitForm();
handleFormReveal();
var db = initDB();
doDisplayQuotes(db, renderConfig);
doSlideShow();
handleSubmit();
}());