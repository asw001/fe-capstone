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

function writeUserData(quote, author, db) {
    var newQuoteKey = db.ref().child('quotes').push().key;
    var quoteData = {
        quote: quote,
        author: author,
        timestamp: new Date().getTime(),
    };

    var updates = {};
    updates['/quotes/' + newQuoteKey] = quoteData;

    return db.ref().update(updates);
};

var db = initDB();

function renderQuotes(renderConfig) {
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
    //var ref = db;
    //$(renderConfig.slideDiv).empty();
    $('div#slideshow').empty();

    ref.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            renderConfig.quote = childSnapshot.val().quote;
            renderConfig.author = childSnapshot.val().author;
            renderQuotes(renderConfig);
        });
    });
}

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
        e.stopPropagation();
        var quote = $(this).find('#quote-text').val();
        var author = $(this).find('#quote-author').val();
        quote = quote.replace(/[\n\r]+/g, ' ');
        author = author.replace(/[\n\r]+/g, ' ');
        console.log(quote + " : " + author);
        if (quote.length > 500) {
            showQuoteErrorInput();
        } else {
            writeUserData(quote, author, db);
            $(this).find('#quote-text').val('');
            $(this).find('#quote-author').val('');
            hideQuoteErrorInput();
            showSubmitSuccess();
            doDisplayQuotes(db, renderConfig);
        }

    }));
};


function doSlideShow() {
$("#slideshow > div:gt(0)").hide();

setInterval(function() {
  $('#slideshow > div:first')
    .fadeOut(1000)
    .next()
    .fadeIn(1000)
    .end()
    .appendTo('#slideshow');
}, 5000);
};

doDisplayQuotes(db, renderConfig);
doSlideShow();
handleSubmit();