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
        })
        // perform a search on the main page when the "Jimmy Search" button is clicked
        $("#main-search-btn").off("click");
        $("#main-search-btn").click(function() {
            makeSearch();
        })
        // perform a search when the magnifying glass is clicked on the search results page
        $("#search-button").off("click");
        $("#search-button").click(function() {
            makeSearch();
        })
        // perform a search after pressing "enter" with the search box focused
        $(document).off("keyup");
        $(document).keyup(function(e) {
            if (e.which == 13 && $("#search-box").is(":focus")) {
                makeSearch();
            }
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
        } else {
            renderPage("main", "#", { logoUrl: LOGO_URL });
            $("#search-box").focus();
        }
        setListeners();
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

    // let's gooooo
    init();
}())
