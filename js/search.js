/*
Functionality related to the search results page, mainly polling for the
query answer, selecting the loading message, loading the recently answered
questions, and stripe interactions when the question is deep in the queue
*/

app.search = {
    // keep track of how many times server has been polled for current question,
    POLL_COUNT: 0,
    // list of messages to display to users while waiting for search results
    LOADING_MESSAGES: [
        "Don't worry, Jimmy is a certified search engine. Your results will appear here when he finishes them.",
        "Jimmy might be sleeping on the job... but we're sure he'll get to your question when someone wakes him up.",
        "Jimmy's working up a sweat answering questions. He will get to yours soon!"
    ],
    // reset looping search variable states, such as timers and poll loops
    resetSearchState: function() {
        app.search.POLL_COUNT = 0;
        if (app.search.timerInterval) {
            clearInterval(app.search.timerInterval);
        }
        app.search.timerInterval = false;
    },
    // Return a random element from LOADING_MESSAGES
    getRandomLoadingMessage: function() {
        var messageNum = Math.floor(Math.random() * app.search.LOADING_MESSAGES.length);
        return app.search.LOADING_MESSAGES[messageNum];
    },
    // Start results joke timer while waiting
    timerInterval: false,
    resultsStartCounter: function() {
        var timer = 0;
        if(app.search.timerInterval == false){
            app.search.timerInterval = setInterval(function(){
                ++timer;
                $("#timer").text(timer);
            }, 1000);
        }
    },
    //poll for a reponse after the given delay in milliseconds
    pollAfterDelay: function(queryId, delay) {
        var prevPollCount = app.search.POLL_COUNT;
        setTimeout(function(){
            // if the poll count changed during the delay, there was most likely
            // a new query so this polling loop should end
            if (prevPollCount == app.search.POLL_COUNT) {
                app.search.checkResponse(queryId);
                app.search.POLL_COUNT++;
            }
        }, delay);
    },
    //get the time in milliseconds that should be waited before
    //polling based on the given position in the question queue
    getPollDelayTime: function(position) {
        if (position < 20) {
            // check every 10 seconds if question in top 20 queue positions
            return 10 * 1000;
        } else {
            // otherwise check after 5 * (position + 1) seconds up to 20 minutes
            return Math.min((position + 1) * 5 * 1000, 20 * 60 * 1000);
        }
    },
    //return the answer to the user and stop polling
    returnAnswer: function(answer) {
        $(".results").text(answer); //put answer in card
        $(".loading").removeClass("loading"); //remove loading dots
        $("#num-results").text("1"); //set number of search results to 1 instead of 0
        app.search.resetSearchState();
    },
    // get the question text for the given queryId either from the cookie
    // or from the server, then set display the question text on the results
    // page. if fetching from the server, update the question text cookie
    setQuestionText: function(queryId) {
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
                        app.search.returnAnswer("Sadly, Jimmy couldn't find your question. Try refreshing the page or asking another one!");
                    }
                },
                error: function(e) {
                    queryText = "Uh oh...";
                    $("#search-question").text(queryText);
                    app.search.returnAnswer("Sadly, Jimmy couldn't find your question. Try refreshing the page or asking another one!");
                }
            })
        }
    },
    //check to see if the answer has
    checkResponse: function(queryId) {
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
                        app.search.returnAnswer(data.answer);
                    } else {
                        app.search.pollAfterDelay(queryId, app.search.getPollDelayTime(data.position));
                        app.search.loadJimmyBump(data.position);
                    }
                },
                error: function(e) {
                    console.log(e);
                }
            });
        }
    },
    // get the list of recent questions in the server queue and render them as
    // list of cards on the search results page
    loadRecentQuestions: function() {
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
    },
    // If the query is deep into the queue give them an ad
    // that allows them to pay
    loadJimmyBump: function(position) {
        if (position > 0) {
            if($("#jimmy-bump-container").children().length == 0) {
                // Render pay dialog
                insertTemplate("jimmyBump", "#jimmy-bump-container",
                {"position": position});

                // Configure Stripe pay button
                var handler = StripeCheckout.configure({
                    key: "pk_test_SKbNm387eH53ZtMsaf1vKtpI",
                    image: "/img/favicon.ico",
                    locale: "auto",
                    token: function(token) {
                        // You can access the token ID with `token.id`.
                        // Get the token ID to your server-side code for use.
                        console.log("Calling!");
                        var hash = window.location.hash.substr(1);
                        var queryId = Number(decodeURIComponent(hash.substring(2)));
                        $.ajax({
                            contentType: "application/json",
                            data: JSON.stringify({
                                key: parseInt(queryId),
                                token: token.id,
                            }),
                            method: 'POST',
                            url: "/api/charge",
                            success: function(data) {
                                data = JSON.parse(data);
                                console.log(data);
                            },
                            error: function(e) {
                                console.log(e);
                            }
                        });
                    }
                });

                // clear pay button event handlers
                $("#stripe-pay-btn").off("click");
                $(window).off("popstate");

                $("#stripe-pay-btn").on("click", function(e) {
                    // Open Checkout with further options:
                    handler.open({
                        name: "Jimmy Search",
                        description: "Move to top of queue",
                        amount: 100
                    });
                    e.preventDefault();
                });

                // Close Checkout on page navigation:
                $(window).on("popstate", function() {
                    handler.close();
                });
            }
        }
    }
}
