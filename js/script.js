(function(){

    // path to the logo images that will be displayed
    var HIDDEN_LOGO_NUMBER;
    var LOGO_NUMBER;
    var LOGO_IS_ROTATING = false;
    // keep track of how many times server has been polled for current question,
    var POLL_COUNT = 0;

    // select the logo url and render the correct page
    function init() {

        // initialize with google logo
        LOGO_NUMBER = 1;

        // set hidden logo number to different random logo number
        HIDDEN_LOGO_NUMBER = LOGO_NUMBER;
        while (HIDDEN_LOGO_NUMBER == LOGO_NUMBER) {
            HIDDEN_LOGO_NUMBER = Math.floor(Math.random() * 6) + 1
        }

        $(document).ready(function() {
            resolveLocation();
        })
    }

    // set all of the event listeners that are needed
    function setListeners() {
        // whenever the url anchor changes, render the correct page
        $(window).off("hashchange");
        $(window).on("hashchange", function() {
            resolveLocation();
        });
        // rotate the logo whenever the user hovers over the logo
        $("#logo-container").off("mouseenter");
        $("#logo-container").mouseenter(function() {
            rotateLogo();
        });
        // rotate the logo whenever the user clicks on the logo
        $("#logo-container").off("click");
        $("#logo-container").click(function() {
            rotateLogo();
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
        // perform a search after pressing "enter" with the search box focused
        $(document).off("keyup");
        $(document).keyup(function(e) {
            if (e.which == 13 && $("#search-box").is(":focus")) {
                makeSearch();
            }
        });
        // get queue of questions from server when "GET QUESTIONS" button clicked
        $("#admin-get-questions").off("click");
        $("#admin-get-questions").click(function() {
            adminGetQuestions();
        })
        // send answer for question to server when "RESPOND" clicked on question card
        $(".answer-btn").off("click");
        $(".answer-btn").click(function(event) {
            adminAnswerQuestion($(event.target).data("question-id"));
        })
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
                while (HIDDEN_LOGO_NUMBER == LOGO_NUMBER) {
                    HIDDEN_LOGO_NUMBER = Math.floor(Math.random() * 6) + 1;
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
    function pollAfterDelay(delay){
        var prevPollCount = POLL_COUNT;
        setTimeout(function(){
            // if the poll count changed during the delay, there was most likely
            // a new query so this polling loop should end
            if (prevPollCount == POLL_COUNT) {
                checkResponse();
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
            // otherwise check after 5 * (position + 1) seconds up to 5 minutes
            return Math.min((position + 1) * 5 * 1000, 5 * 60 * 1000);
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
        insertTemplate(name, "body", context);
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
            renderPage("search", window.location.hash, { logoUrl: getLogoUrl(LOGO_NUMBER) });
            // set the contents of the search box  and card to be query
            var query = decodeURIComponent(hash.substring(2));
            $("#search-box").val(query);
            $(".search-text").text(query.charAt(0).toUpperCase() + query.slice(1));
            resetSearchState(); //reset search result timers and poll loops
            resultsStartCounter(); //start counting
            pollAfterDelay(0); //start checking
            loadRecentQuestions(); //fetch and render recent searches
        }  else if (hash == "admin") {
            renderPage("admin", window.location.hash, {});
            adminGetQuestions(); //fetch queue of unanswered questions
        } else {
            var context = {
                logoUrl: getLogoUrl(LOGO_NUMBER),
                hiddenLogoUrl: getLogoUrl(HIDDEN_LOGO_NUMBER)
            }
            renderPage("main", "#", context);
            $("#search-box").focus();
        }
    }

    // if there is a query in the search box, then perform a search
    function makeSearch() {
        var query = $("#search-box").val().trim();
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
                        // Save query id to session cookie
                        Cookies.set("queryId", data.key);
                        // send the user to the search results page
                        renderPage("search", "#q=" + encodeURIComponent(query), { logoUrl: getLogoUrl(LOGO_NUMBER) });
                        // set the contents of the search box to be the query
                        $("#search-box").val(query);
                        resetSearchState();
                        resultsStartCounter();
                        pollAfterDelay(getPollDelayTime(0));
                    }
                },
                error: function(e) {
                    console.log(e);
                }
            });
        }
    }

    //check to see if the answer has
    function checkResponse(){
        var queryId = Cookies.get("queryId");
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
                        pollAfterDelay(getPollDelayTime(data.position));
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

    // if the server base url is provided, make a request to get the queue
    // of questions that need to be answered and display each question on a card
    function adminGetQuestions() {
        $.ajax({
            url: "/api/queue",
            success: function(data) {
                data = JSON.parse(data);
                if (data.status == "true") {
                    // pass the queue of questions as context to the
                    // template that will render each question as a card
                    insertTemplate("questionCards", "#question-list", data);
                }
            },
            error: function(e) {
                console.log(e);
            }
        });
    }

    // if the server base url and an answer to the question with the given id
    // are provided, send a request to the server to answer the question and
    // delete the card displaying this question
    function adminAnswerQuestion(id) {
        var answer = $(".answer-input[data-question-id='" + id + "']").val().trim();
        if (answer) {
            $.ajax({
                contentType: "application/json",
                data: JSON.stringify({
                    key: id,
                    answer: answer
                }),
                method: 'POST',
                url: "/api/answer",
                success: function(data) {
                    data = JSON.parse(data);
                    if (data.status == "true") {
                        // delete the card if successful
                        $(".question-card[data-question-id='" + id + "']").remove();
                    }
                },
                error: function(e) {
                    console.log(e);
                }
            });
        }
    }

    // let's gooooo
    init();
}())
