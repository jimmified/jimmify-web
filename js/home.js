app = app || {};
/*
Functionality related to the home page, mainly logo interactions,
main search bar interactions, and app drawer interactions.
*/

app.home = {
    // true if the logo is currently rotating to the next logo
    LOGO_IS_ROTATING: false,
    // true if the "I'm Feeling Jimmy" button is currently rotating
    FEELING_JIMMY_IS_ROTATING: false,
    // get the path to the image file of the given logo number
    getLogoUrl: function(logoNumber) {
        return "img/logo" + parseInt(logoNumber) + ".png";
    },

    // slide the hidden logo into the displayed logo's place, then reset
    // the elements behind the scenes while keeping the new logo displayed
    rotateLogo: function() {
        if (!app.home.LOGO_IS_ROTATING) {
            app.home.LOGO_IS_ROTATING = true;
            $("#hidden-logo").animate({top: 0}, 400, "swing");
            $("#visible-logo").animate({top: 0}, 400, "swing", function() {
                // set the new logo number, randomize hidden logo number
                LOGO_NUMBER = HIDDEN_LOGO_NUMBER;
                HIDDEN_LOGO_NUMBER = LOGO_NUMBER + 1;
                if (HIDDEN_LOGO_NUMBER > 6) {
                    HIDDEN_LOGO_NUMBER = 1;
                }
                // reset image elements so logos can be rotated again
                $("#visible-logo").attr("src", app.home.getLogoUrl(LOGO_NUMBER));
                $("#visible-logo").css("top", "-160px");
                $("#hidden-logo").attr("src", app.home.getLogoUrl(HIDDEN_LOGO_NUMBER));
                $("#hidden-logo").css("top", "-160px");
                app.home.LOGO_IS_ROTATING = false;
            });
        }
    },

    // rotate the "I'm Feeling Jimmy" button to a random different
    // "I'm Feeling Jimmy" then reset the elements behind the scenes
    rotateFeelingJimmy: function() {
        // randomly choose a new different "I'm Feeling Different" to spin to.
        // note the original position is position 3, counting from 0
        var newFeelingJimmyPos = 4;
        while (newFeelingJimmyPos == 4) {
            newFeelingJimmyPos = Math.floor(Math.random() * 9);
        }

        if (!app.home.FEELING_JIMMY_IS_ROTATING) {
            app.home.FEELING_JIMMY_IS_ROTATING = true;
            setTimeout(function() {
                if ($("#lucky-search-btn").is(":hover")) {
                    // get pixel offset of new scroll position
                    var pixelOffset = (newFeelingJimmyPos * -36) + "px";
                    // scroll to new position
                    $("#feeling-jimmy-container").animate({top: pixelOffset}, 400, "swing", function() {
                        // reset elements to original positions
                        $("#feeling-jimmy-container").css("top", "-144px");
                        app.home.FEELING_JIMMY_IS_ROTATING = false;
                    });
                } else {
                    app.home.FEELING_JIMMY_IS_ROTATING = false;
                }
            }, 200);
        }
    },

    // add box shadow to search box div if input is true.
    // remove box shadow otherwise
    changeSearchBoxShadow: function(addShadow) {
        if (addShadow) {
            $(".search-box-div").addClass("search-box-focus-shadow");
        } else {
            $(".search-box-div").removeClass("search-box-focus-shadow");
        }
    },

    // logs click of app drawer icon using google analytics
    appDrawerClickAnalytics: function(appName) {
        if (appName) {
            ga("send", "event", {
                "eventCategory": "AppDrawer",
                "eventAction": "Click",
                "eventLabel": appName
            });
        }
    }
};
