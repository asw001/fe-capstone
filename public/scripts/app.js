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

function checkUserAuth() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            user.getIdToken().then(function(accessToken) {
                document.getElementById('sign-in-status').textContent = 'Signed in';
            });
        } else {

        }
    }, function(error) {
        console.log(error);
    });
};


function initDB() {
    var database = firebase.database();
    return database;
};

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
    $('div#slideshow').empty();

    ref.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            renderConfig.quote = childSnapshot.val().quote;
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
        quote = quote.replace(/[\n\r]+/g, ' ');
        author = author.replace(/[\n\r]+/g, ' ');

        if (quote.length > 600) {
            showQuoteErrorInput();
        } else {
            writeUserData(quote, author, db);
            $(this).find('#quote-text').val('');
            $(this).find('#quote-author').val('');
            hideQuoteErrorInput();
            showSubmitSuccess();
            doDisplayQuotes(db, renderConfig);
            hideSubmitForm();
        }
    }));
};

function doSlideShow() {
    $("#slideshow > div:first").show();

    setInterval(function() {
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