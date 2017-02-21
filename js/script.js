(function(){

    // number of the hidden logo that will be displayed on rotation
    var HIDDEN_LOGO_NUMBER;
    // number of the logo that is currently displayed
    var LOGO_NUMBER;
    // true if the logo is currently rotating to the next logo
    var LOGO_IS_ROTATING = false;
    // true if the "I'm Feeling Jimmy" button is currently rotating
    var FEELING_JIMMY_IS_ROTATING = false;
    // keep track of how many times server has been polled for current question,
    var POLL_COUNT = 0;

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
            rotateLogo();
        });
        // rotate the "I'm Feeling Jimmy" text when the user hovers over the button
        $("#lucky-search-btn").off("mouseenter");
        $("#lucky-search-btn").mouseenter(function() {
            rotateFeelingJimmy();
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
                adminAnswerQuestion($(":focus").data("question-id"));
            } else if ($("#username-input").is(":focus") || $("#password-input").is(":focus")) {
                // login username or password text box
                var username = $("#username-input").val().trim();
                var password = $("#password-input").val();
                adminLogin(username, password);
            }
        });
        // add box shadow to search box when the user focuses on the search input
        $(".search-box-input").off("focus");
        $(".search-box-input").focus(function() {
            changeSearchBoxShadow(true);
        });
        // remove box shadow from search box when the search input loses focus
        $(".search-box-input").off("blur");
        $(".search-box-input").blur(function() {
            changeSearchBoxShadow(false);
        });
        // try to login as admin when "LOGIN" button clicked
        $("#admin-login-btn").off("click");
        $("#admin-login-btn").click(function() {
            var username = $("#username-input").val().trim();
            var password = $("#password-input").val();
            adminLogin(username, password);
        });
        // remove "auth" cookie and send user to admin login when "LOGOUT" button clicked
        $("#admin-logout-btn").off("click");
        $("#admin-logout-btn").click(function() {
            adminLogout();
        });
        // get queue of questions from server when "GET QUESTIONS" button clicked
        $("#admin-get-questions").off("click");
        $("#admin-get-questions").click(function() {
            adminGetQuestions();
        });
        // send answer for question to server when "RESPOND" clicked on question card
        $(".answer-btn").off("click");
        $(".answer-btn").click(function(event) {
            adminAnswerQuestion($(event.target).data("question-id"));
        });
        // hide/show app drawer on click of app drawer icon
        $("#app-drawer-toggle").off("click");
        $("#app-drawer-toggle").click(function() {
            var appDrawerContainer = $("#app-drawer-container");
            if (appDrawerContainer.css("display") === "none") {
                appDrawerContainer.css("display", "block");
            } else {
                appDrawerContainer.css("display", "none");
            }
        });
        // log clicks on app drawer icons with google analytics
        $(".app").off("click");
        $(".app").click(function() {
            var appName = $(this).find(".app-name").text();
            appDrawerClickAnalytics(appName);
        });
    }

    // get the path to the image file of the given logo number
    function getLogoUrl(logoNumber) {
        return "img/logo" + parseInt(logoNumber) + ".png";
    }

    // slide the hidden logo into the displayed logo's place, then reset
    // the elements behind the scenes while keeping the new logo displayed
    function rotateLogo() {
        if (!LOGO_IS_ROTATING) {
            LOGO_IS_ROTATING = true;
            $("#hidden-logo").animate({top: 0}, 400, "swing");
            $("#visible-logo").animate({top: 0}, 400, "swing", function() {
                // set the new logo number, randomize hidden logo number
                LOGO_NUMBER = HIDDEN_LOGO_NUMBER;
                HIDDEN_LOGO_NUMBER = LOGO_NUMBER + 1;
                if (HIDDEN_LOGO_NUMBER > 6) {
                    HIDDEN_LOGO_NUMBER = 1;
                }
                // reset image elements so logos can be rotated again
                $("#visible-logo").attr("src", getLogoUrl(LOGO_NUMBER));
                $("#visible-logo").css("top", "-160px");
                $("#hidden-logo").attr("src", getLogoUrl(HIDDEN_LOGO_NUMBER));
                $("#hidden-logo").css("top", "-160px");
                LOGO_IS_ROTATING = false;
            });
        }
    }

    // rotate the "I'm Feeling Jimmy" button to a random different
    // "I'm Feeling Jimmy" then reset the elements behind the scenes
    function rotateFeelingJimmy() {
        // randomly choose a new different "I'm Feeling Different" to spin to.
        // note the original position is position 3, counting from 0
        var newFeelingJimmyPos = 4;
        while (newFeelingJimmyPos == 4) {
            newFeelingJimmyPos = Math.floor(Math.random() * 9);
        }

        if (!FEELING_JIMMY_IS_ROTATING) {
            FEELING_JIMMY_IS_ROTATING = true;
            setTimeout(function() {
                if ($("#lucky-search-btn").is(":hover")) {
                    // get pixel offset of new scroll position
                    var pixelOffset = (newFeelingJimmyPos * -36) + "px";
                    // scroll to new position
                    $("#feeling-jimmy-container").animate({top: pixelOffset}, 400, "swing", function() {
                        // reset elements to original positions
                        $("#feeling-jimmy-container").css("top", "-144px");
                        FEELING_JIMMY_IS_ROTATING = false;
                    });
                } else {
                    FEELING_JIMMY_IS_ROTATING = false;
                }
            }, 200);
        }
    }

    // add box shadow to search box div if input is true.
    // remove box shadow otherwise
    function changeSearchBoxShadow(addShadow) {
        if (addShadow) {
            $(".search-box-div").addClass("search-box-focus-shadow");
        } else {
            $(".search-box-div").removeClass("search-box-focus-shadow");
        }
    }

    // Start results joke timer while waiting
    var timerInterval = false;
    function resultsStartCounter(){
        var timer = 0;
        if(timerInterval == false){
            timerInterval = setInterval(function(){
                ++timer;
                $("#timer").text(timer);
            }, 1000);
        }
    }

    //poll for a reponse after the given delay in milliseconds
    function pollAfterDelay(queryId, delay){
        var prevPollCount = POLL_COUNT;
        setTimeout(function(){
            // if the poll count changed during the delay, there was most likely
            // a new query so this polling loop should end
            if (prevPollCount == POLL_COUNT) {
                checkResponse(queryId);
                POLL_COUNT++;
            }
        }, delay);
    }

    //get the time in milliseconds that should be waited before
    //polling based on the given position in the question queue
    function getPollDelayTime(position){
        if (position < 20) {
            // check every 10 seconds if question in top 20 queue positions
            return 10 * 1000;
        } else {
            // otherwise check after 5 * (position + 1) seconds up to 20 minutes
            return Math.min((position + 1) * 5 * 1000, 20 * 60 * 1000);
        }
    }

    // reset looping search variable states, such as timers and poll loops
    function resetSearchState() {
        POLL_COUNT = 0;
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        timerInterval = false;
    }

    //return the answer to the user and stop polling
    function returnAnswer(answer) {
        $(".results").text(answer); //put answer in card
        $(".loading").removeClass("loading"); //remove loading dots
        $("#num-results").text("1"); //set number of search results to 1 instead of 0
        resetSearchState();
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

    // logs click of app drawer icon using google analytics
    function appDrawerClickAnalytics(appName) {
        if (appName) {
            ga("send", "event", {
                "eventCategory": "AppDrawer",
                "eventAction": "Click",
                "eventLabel": appName
            });
        }
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

    // look at the current url. if the anchor component has the form "#q={query}"
    // then render the search results page for the query. otherwise render the main page.
    function resolveLocation() {
        // get the string after the hash
        var hash = window.location.hash.substr(1);
        if (hash.substring(0, 2) == "q=" && hash.length > 2) {
            var queryId = Number(decodeURIComponent(hash.substring(2)));
            renderPage("search", window.location.hash, {logoUrl: getLogoUrl(LOGO_NUMBER)});
            setQuestionText(queryId);
            resetSearchState(); //reset search result timers and poll loops
            resultsStartCounter(); //start counting
            pollAfterDelay(queryId, 0); //start checking
            loadRecentQuestions(); //fetch and render recent searches
        } else if (hash == "login" || hash == "admin") {
            if (isAdmin()) {
                renderPage("admin", "#admin", {});
                adminGetQuestions(); //fetch queue of unanswered questions
            } else {
                renderPage("login", "#login", {});
                $("#username-input").focus();
            }
        } else {
            var context = {
                logoUrl: getLogoUrl(LOGO_NUMBER),
                hiddenLogoUrl: getLogoUrl(HIDDEN_LOGO_NUMBER)
            }
            renderPage("main", "#", context);
            $(".search-box-input").focus();
        }
    }

    // get the question text for the given queryId either from the cookie
    // or from the server, then set display the question text on the results
    // page. if fetching from the server, update the question text cookie
    function setQuestionText(queryId) {
        var queryText;
        var cachedQueries = JSON.parse(Cookies.get("queryText"));

        if (cachedQueries[queryId]) {
            queryText = cachedQueries[queryId];
            $("#search-question").text(queryText);
            // set the contents of the search box and card to be query
            $(".search-box-input").val(queryText);
        } else {
            $.ajax({
                contentType: "application/json",
                data: JSON.stringify({
                    key: queryId
                }),
                method: 'POST',
                url: "/api/question",
                success: function(data) {
                    data = JSON.parse(data);
                    if (data.status == "true") {
                        queryText = data.text;
                        updateCachedQueries(queryId, queryText);
                        // display question text
                        $("#search-question").text(queryText);
                        // set the contents of the search box and card to be query
                        $(".search-box-input").val(queryText);
                    } else {
                        queryText = "Uh oh...";
                        $("#search-question").text(queryText);
                        returnAnswer("Sadly, Jimmy couldn't find your question. Try refreshing the page or asking another one!");
                    }
                },
                error: function(e) {
                    queryText = "Uh oh...";
                    $("#search-question").text(queryText);
                    returnAnswer("Sadly, Jimmy couldn't find your question. Try refreshing the page or asking another one!");
                }
            })
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
                        insertTemplate("search", "body", { logoUrl: getLogoUrl(LOGO_NUMBER)});
                        // set the contents of the search box to be the query
                        $(".search-box-input").val(query);
                        resetSearchState();
                        resultsStartCounter();
                        pollAfterDelay(data.key, getPollDelayTime(0));
                    }
                },
                error: function(e) {
                    console.log(e);
                }
            });
        }
    }

    //check to see if the answer has
    function checkResponse(queryId){
        if (queryId) {
            //We have an ID to check
            $.ajax({
                contentType: "application/json",
                data: JSON.stringify({
                    key: parseInt(queryId),
                }),
                method: 'POST',
                url: "/api/check",
                success: function(data) {
                    data = JSON.parse(data);
                    if (data.status == "true") {
                        // We have an answer
                        returnAnswer(data.answer);
                    } else {
                        pollAfterDelay(queryId, getPollDelayTime(data.position));
                    }
                },
                error: function(e) {
                    console.log(e);
                }
            });
        }
    }

    // get the list of recent questions in the server queue and render them as
    // list of cards on the search results page
    function loadRecentQuestions() {
        $.ajax({
            url: "/api/recent",
            success: function(data) {
                data = JSON.parse(data);
                if (data.status == "true") {
                    // collect only search results from the recent queue items
                    var recentSearches = [];
                    for (var i = 0; i < data.recents.length; i++) {
                        var recentSearch = data.recents[i];
                        if (recentSearch.type == "search" && recentSearch.text && recentSearch.answer) {
                            recentSearches.push(recentSearch);
                        }
                    }
                    // only render if there are recent search results
                    if (recentSearches.length) {
                        insertTemplate("recentCards", "#recent-container", {"recents": recentSearches});
                    }
                }
            },
            error: function(e) {
                console.log(e);
            }
        })
    }

    // return true if the admin is logged in (has "auth" cookie set),
    // return false otherwise
    function isAdmin() {
        return !!Cookies.get("auth");
    }

    // try to login as admin with username and password. if successful,
    // set jwt in response to cookie that expires after a week and navigate
    // user to admin page
    function adminLogin(username, password) {
        if (username && password) {
            $.ajax({
                contentType: "application/json",
                data: JSON.stringify({
                    username: username,
                    password: password
                }),
                method: 'POST',
                url: "/api/login",
                success: function(data) {
                    data = JSON.parse(data);
                    if (data.status == "true") {
                        Cookies.set("auth", data.token, { expires: 7 });
                        renderPage("admin", "#admin", {});
                    }

                },
                error: function(e) {
                    console.log(e);
                }
            });
        }
    }

    // remove the "auth" cookie and send the user back to admin login page
    function adminLogout() {
        Cookies.remove("auth");
        renderPage("login", "#login", {});
    }

    // if there is at least one question to be answered in the admin interface,
    // focus the input field of the top question
    function adminFocusTopQuestion() {
        var answerInputs = $(".answer-input");
        if (answerInputs.length) {
            // remember previous scroll positions so that focusing doesn't change scroll positions
            var x = document.body.scrollLeft, y = document.body.scrollTop;
            $(answerInputs[0]).focus();
            window.scrollTo(x, y);
        }
    }

    // if the server base url is provided, make a request to get the queue
    // of questions that need to be answered and display each question on a card
    function adminGetQuestions() {
        if (!isAdmin()) {
            return adminLogout();
        }
        $.ajax({
            url: "/api/queue?token=" + Cookies.get("auth"),
            success: function(data) {
                data = JSON.parse(data);
                if (data.status == "true") {
                    // pass the queue of questions as context to the
                    // template that will render each question as a card
                    insertTemplate("questionCards", "#question-list", data);
                    adminFocusTopQuestion();
                }
            },
            error: function(e) {
                console.log(e);
                if (e.status == 401) {
                    adminLogout();
                }
            }
        });
    }

    // if the server base url and an answer to the question with the given id
    // are provided, send a request to the server to answer the question and
    // delete the card displaying this question
    function adminAnswerQuestion(id) {
        if (!isAdmin()) {
            return adminLogout();
        }
        var answer = $(".answer-input[data-question-id='" + id + "']").val().trim();
        if (answer) {
            $.ajax({
                contentType: "application/json",
                data: JSON.stringify({
                    key: id,
                    answer: answer,
                    token: Cookies.get("auth")
                }),
                method: 'POST',
                url: "/api/answer",
                success: function(data) {
                    data = JSON.parse(data);
                    if (data.status == "true") {
                        // delete the card if successful
                        $(".question-card[data-question-id='" + id + "']").remove();
                        adminFocusTopQuestion();
                    }
                },
                error: function(e) {
                    console.log(e);
                    if (e.status == 401) {
                        adminLogout();
                    }
                }
            });
        }
    }

    // let's gooooo
    init();
}())
