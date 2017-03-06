var app = app || {};

/*
Functionality related to the app overall, mainly event listeners,
rendering new pages, making a search, and cookies
*/

// number of the hidden logo that will be displayed on rotation
var HIDDEN_LOGO_NUMBER;
// number of the logo that is currently displayed
var LOGO_NUMBER;

// select the logo url and render the correct page
function init() {

    // allow Handlebars templates to be used as partials
    Handlebars.partials = Templates;

    // initialize queryText cookie if not already present
    if (!Cookies.get("queryText")) {
        Cookies.set("queryText", "{}");
    }

    // initialize with google logo
    LOGO_NUMBER = 1;

    // set hidden logo number to different random logo number
    HIDDEN_LOGO_NUMBER = LOGO_NUMBER;
    while (HIDDEN_LOGO_NUMBER == LOGO_NUMBER) {
        HIDDEN_LOGO_NUMBER = Math.floor(Math.random() * 6) + 1
    }

    $(document).ready(function() {
        resolveLocation();
    });
}

// set all of the event listeners that are needed
function setListeners() {
    // whenever the url anchor changes, render the correct page
    $(window).off("hashchange");
    $(window).on("hashchange", function() {
        resolveLocation();
    });
    // rotate the logo whenever the user clicks on the logo
    $("#lucky-search-btn").off("click");
    $("#lucky-search-btn").click(function() {
        app.home.rotateLogo();
    });
    // rotate the "I'm Feeling Jimmy" text when the user hovers over the button
    $("#lucky-search-btn").off("mouseenter");
    $("#lucky-search-btn").mouseenter(function() {
        app.home.rotateFeelingJimmy();
    });
    // perform a search on the main page when the "Jimmy Search" button is clicked
    $("#main-search-btn").off("click");
    $("#main-search-btn").click(function() {
        makeSearch();
    });
    // perform a search when the magnifying glass is clicked on the search results page
    $("#search-button").off("click");
    $("#search-button").click(function() {
        makeSearch();
    });

    // perform various actions after pressing "enter" depending on which element is focused
    $(document).off("keyup");
    $(document).keyup(function(e) {
        // ignore keys presses that aren't "enter"
        if (e.which != 13) {
            return;
        }
        if ($(".search-box-input").is(":focus")) {
            // search box on main page or search results page
            makeSearch();
        } else if ($(".answer-input").is(":focus")) {
            // answer text box in admin interface
            app.admin.answerQuestion($(":focus").data("question-id"));
        } else if ($("#username-input").is(":focus") || $("#password-input").is(":focus")) {
            // login username or password text box
            var username = $("#username-input").val().trim();
            var password = $("#password-input").val();
            app.admin.login(username, password);
        }
    });
    // add box shadow to search box when the user focuses on the search input
    $(".search-box-input").off("focus");
    $(".search-box-input").focus(function() {
        app.home.changeSearchBoxShadow(true);
    });
    // remove box shadow from search box when the search input loses focus
    $(".search-box-input").off("blur");
    $(".search-box-input").blur(function() {
        app.home.changeSearchBoxShadow(false);
    });
    // try to login as admin when "LOGIN" button clicked
    $("#admin-login-btn").off("click");
    $("#admin-login-btn").click(function() {
        var username = $("#username-input").val().trim();
        var password = $("#password-input").val();
        app.admin.login(username, password);
    });
    // remove "auth" cookie and send user to admin login when "LOGOUT" button clicked
    $("#admin-logout-btn").off("click");
    $("#admin-logout-btn").click(function() {
        app.admin.logout();
    });
    // get queue of questions from server when "GET QUESTIONS" button clicked
    $("#admin-get-questions").off("click");
    $("#admin-get-questions").click(function() {
        app.admin.getQuestions();
    });
    // send answer for question to server when "RESPOND" clicked on question card
    $(".answer-btn").off("click");
    $(".answer-btn").click(function(event) {
        app.admin.answerQuestion($(event.target).data("question-id"));
    });
    // hide/show app drawer on click of app drawer icon
    $("#app-drawer-toggle").off("click");
    $("#app-drawer-toggle").click(function() {
        var appDrawerContainer = $("#app-drawer-container");
        if (!appDrawerContainer.is(":visible")) {
            appDrawerContainer.show();
        } else {
            appDrawerContainer.hide();
        }
    });
    // click events for the entire document
    $(document).off("click");
    $(document).click(function(event) {
        // hide the app drawer if anything outside the app drawer is clicked on
        var appDrawerContainer = $("#app-drawer-container");
        if (!$(event.target).closest("#app-drawer-container, #app-drawer-toggle").length) {
            if (appDrawerContainer.is(":visible")) {
                appDrawerContainer.hide();
            }
        }
    });
    // log clicks on app drawer icons with google analytics
    $(".app").off("click");
    $(".app").click(function() {
        var appName = $(this).find(".app-name").text();
        app.home.appDrawerClickAnalytics(appName);
    });
}

// insert the Handlebars template into the page.
// name should be the name of the Handlebars template, i.e. main.hbs -> "main",
// containerSelector should be the jQuery selector for the element that will have
//                   its HTML be set to the Handlebars template
// context should be a JSON object that acts as the context for the template
function insertTemplate(name, containerSelector, context) {
    $(containerSelector).html(Templates[name](context));
    setListeners();
}

// change the current URL and render the specified Handlebars template.
// name should be the name of the Handlebars template, i.e. main.hbs -> "main",
// href should typically just be the anchor portion, i.e. "#q=abc",
// context should be a JSON object that acts as the context for the template
function renderPage(name, href, context) {
    location.href = href;
    // update google analytics tracker
    ga("set", "page", "/" + name);
    ga("send", "pageview");
    insertTemplate(name, "body", context);
}

// look at the current url. if the anchor component has the form "#q={queryId}"
// then render the search results page for the query. otherwise render the main page.
function resolveLocation() {
    // get the string after the hash
    var hash = window.location.hash.substr(1);
    if (hash.substring(0, 2) == "q=" && hash.length > 2) {
        var queryId = Number(decodeURIComponent(hash.substring(2)));
        renderPage("search", window.location.hash, {logoUrl: app.home.getLogoUrl(LOGO_NUMBER), loadingMessage: app.search.getRandomLoadingMessage()});
        app.search.setQuestionText(queryId);
        app.search.resetSearchState(); //reset search result timers and poll loops
        app.search.resultsStartCounter(); //start counting
        app.search.pollAfterDelay(queryId, 0); //start checking
        app.search.loadRecentQuestions(); //fetch and render recent searches
    } else if (hash == "login" || hash == "admin") {
        if (app.admin.isAdmin()) {
            renderPage("admin", "#admin", {});
            app.admin.getQuestions(); //fetch queue of unanswered questions
        } else {
            renderPage("login", "#login", {});
            $("#username-input").focus();
        }
    } else if (hash == "privacy") {
        renderPage("privacy", "#privacy", {});
    } else if (hash == "terms") {
        renderPage("terms", "#terms", {});
    } else if (hash == "about") {
        renderPage("about", "#about", {});
    } else {
        var context = {
            logoUrl: app.home.getLogoUrl(LOGO_NUMBER),
            hiddenLogoUrl: app.home.getLogoUrl(HIDDEN_LOGO_NUMBER)
        }
        renderPage("main", "#", context);
        $(".search-box-input").focus();
    }
}

// if there is a query in the search box, then perform a search
function makeSearch() {
    var query = $(".search-box-input").val().trim();
    if (query) {
        // send the query to the server
        $.ajax({
            contentType: "application/json",
            data: JSON.stringify({
                text: query,
                type: "search"
            }),
            method: 'POST',
            url: "/api/query",
            success: function(data) {
                data = JSON.parse(data);
                if (data.status == "true") {
                    // Save query text to session cookie
                    updateCachedQueries(Number(data.key), query);
                    // send the user to the search results page
                    location.href = "#q=" + encodeURIComponent(data.key);
                    insertTemplate("search", "body", { logoUrl: app.home.getLogoUrl(LOGO_NUMBER), loadingMessage: app.search.getRandomLoadingMessage()});
                    // set the contents of the search box to be the query
                    $(".search-box-input").val(query);
                    app.search.resetSearchState();
                    app.search.resultsStartCounter();
                    app.search.pollAfterDelay(data.key, app.search.getPollDelayTime(0));
                }
            },
            error: function(e) {
                console.log(e);
            }
        });
    }
}

// adds the given query id and query text to the queryText cookie.
// however, if the current size of the cookie is already large,
// first remove the currently cached query texts
function updateCachedQueries(queryId, queryText) {
    var cachedQueries;
    var cachedQueriesString = Cookies.get("queryText");
    if (cachedQueriesString.length > 3000) {
        cachedQueries = {};
    } else {
        cachedQueries = JSON.parse(cachedQueriesString);
    }
    cachedQueries[queryId] = queryText;
    Cookies.set("queryText", JSON.stringify(cachedQueries));
}

init();
