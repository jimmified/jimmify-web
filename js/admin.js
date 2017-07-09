var app = app || {};

/*
Functionality related to the admin page (login, getting unanswered questions,
answering questions)
*/

app.admin = {
    // return true if the admin is logged in (has "auth" cookie set),
    // return false otherwise
    isAdmin: function() {
        return !!Cookies.get("auth");
    },

    // try to login as admin with username and password. if successful,
    // set jwt in response to cookie that expires after a week and navigate
    // user to admin page
    login: function(username, password) {
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
                    if (data.status) {
                        Cookies.set("auth", data.token, { expires: 7 });
                        renderPage("admin", "#admin", {});
                    }

                },
                error: function(e) {
                    console.log(e);
                }
            });
        }
    },

    // remove the "auth" cookie and send the user back to admin login page
    logout: function() {
        Cookies.remove("auth");
        renderPage("login", "#login", {});
    },

    // if there is at least one question to be answered in the admin interface,
    // focus the input field of the top question
    focusTopQuestion: function() {
        var answerInputs = $(".answer-input");
        if (answerInputs.length) {
            // remember previous scroll positions so that focusing doesn't change scroll positions
            var x = document.body.scrollLeft, y = document.body.scrollTop;
            $(answerInputs[0]).focus();
            window.scrollTo(x, y);
        }
    },

    // if the server base url is provided, make a request to get the queue
    // of questions that need to be answered and display each question on a card
    getQuestions: function() {
        if (!app.admin.isAdmin()) {
            return app.admin.logout();
        }
        $.ajax({
            url: "/api/queue?token=" + Cookies.get("auth"),
            success: function(data) {
                data = JSON.parse(data);
                if (data.status) {
                    // pass the queue of questions as context to the
                    // template that will render each question as a card
                    insertTemplate("questionCards", "#question-list", data);
                    app.admin.focusTopQuestion();
                }
            },
            error: function(e) {
                console.log(e);
                if (e.status == 401) {
                    app.admin.logout();
                }
            }
        });
    },

    // if the server base url and an answer to the question with the given id
    // are provided, send a request to the server to answer the question and
    // delete the card displaying this question
    answerQuestion: function(id) {
        if (!app.admin.isAdmin()) {
            return app.admin.logout();
        }
        var answer = $(".answer-input[data-question-id='" + id + "']").val().trim();
        var links = [];
        var linkDivs = $(".answer-link[data-question-id='" + id + "']");
        for (var i = 0; i < linkDivs.length; i++) {
            var url = $(linkDivs[i]).val().trim();
            if (url) {
                links.push(url)
            }
        }
        if (answer) {
            $.ajax({
                contentType: "application/json",
                data: JSON.stringify({
                    key: id,
                    answer: answer,
                    list: links,
                    token: Cookies.get("auth"),
                    type: "search"
                }),
                method: 'POST',
                url: "/api/answer",
                success: function(data) {
                    data = JSON.parse(data);
                    if (data.status == "true") {
                        // delete the card if successful
                        $(".question-card[data-question-id='" + id + "']").remove();
                        app.admin.focusTopQuestion();
                    }
                },
                error: function(e) {
                    console.log(e);
                    if (e.status == 401) {
                        app.admin.logout();
                    }
                }
            });
        }
    }
}
