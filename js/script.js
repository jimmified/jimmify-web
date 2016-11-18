(function(){

    // path to the logo images that will be displayed
    var LOGO_URL;

    // select the logo url and render the correct page
    function init() {

        setLogoUrl();

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
            answerQuestion($(event.target).data("question-id"));
        })
    }

    // set LOGO_URL to be the path to a random logo image
    function setLogoUrl() {
        var i = Math.floor(Math.random() * (6)) + 1;
        LOGO_URL = "img/logo" + parseInt(i) + ".png";
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
            renderPage("search", window.location.hash, { logoUrl: LOGO_URL });
            // set the contents of the search box to be query
            $("#search-box").val(decodeURIComponent(hash.substring(2)));
        }  else if (hash == "admin") {
            renderPage("admin", window.location.hash, {});
        } else {
            renderPage("main", "#", { logoUrl: LOGO_URL });
            $("#search-box").focus();
        }
    }

    // if there is a query in the search box, then perform a search
    function makeSearch() {
        var query = $("#search-box").val().trim();
        if (query) {
            renderPage("search", "#q=" + encodeURIComponent(query), { logoUrl: LOGO_URL });
            // set the contents of the search box to be the query
            $("#search-box").val(query);
        }
    }

    // on the admin page, get the value in the server base url input field
    function adminGetBaseUrl() {
        return $("#server-base-url").val().trim();
    }

    // if the server base url is provided, make a request to get the queue
    // of questions that need to be answered and display each question on a card
    function adminGetQuestions() {
        var serverBaseUrl = adminGetBaseUrl();
        // prepend http:// if not present
        if (serverBaseUrl && (serverBaseUrl.substring(0, 4) != "http")) {
            serverBaseUrl = "http://" + serverBaseUrl;
        }
        if (serverBaseUrl) {
            $.ajax({
                url: serverBaseUrl + "/queue",
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
    }

    // if the server base url and an answer to the question with the given id
    // are provided, send a request to the server to answer the question and
    // delete the card displaying this question
    function answerQuestion(id) {
        var serverBaseUrl = adminGetBaseUrl();
        var answer = $(".answer-input[data-question-id='" + id + "']").val().trim();
        if (serverBaseUrl && answer) {
            $.ajax({
                contentType: "application/json",
                data: JSON.stringify({
                    key: id,
                    answer: answer
                }),
                method: 'POST',
                url: serverBaseUrl + "/answer",
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
