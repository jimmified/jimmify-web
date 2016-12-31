this["Templates"] = this["Templates"] || {};

this["Templates"]["admin"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"material-body\">\n    <div style=\"background: #039BE5;\" id=\"hero\">\n        <div id=\"title-bar\">\n            <div>\n                <h1>Jimmy Console</h1>\n                <h2 id=\"subtitle\">Preach to the people</h2>\n            </div>\n        </div>\n    </div>\n</div>\n<div id=\"page-wrap\">\n    <div class=\"card\">\n        <div class=\"card-title\">TurboJim AnswerXchange</div>\n        <div class=\"card-text\">Go get some questions to answer!</div>\n        <a id=\"admin-get-questions\" class=\"btn-flat\">GET QUESTIONS</a>\n    </div>\n    <div id=\"question-list\">\n    </div>\n</div>\n";
},"useData":true});

this["Templates"]["main"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div>\n    <div id=\"logo-container\">\n        <img id=\"hidden-logo\" class=\"logo\" src="
    + alias4(((helper = (helper = helpers.hiddenLogoUrl || (depth0 != null ? depth0.hiddenLogoUrl : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"hiddenLogoUrl","hash":{},"data":data}) : helper)))
    + "></img>\n        <img id=\"visible-logo\" class=\"logo\" src="
    + alias4(((helper = (helper = helpers.logoUrl || (depth0 != null ? depth0.logoUrl : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"logoUrl","hash":{},"data":data}) : helper)))
    + "></img>\n    </div>\n    <div id=\"main-search-box-container\" class=\"search-box-container\">\n        <div class=\"search-box-div\">\n            <input id=\"main-search-box\" class=\"search-box-input\" type=\"text\" placeholder=\"Ask Jimmy\" maxlength=\"255\"/>\n        </div>\n    </div>\n    <center id=\"search-btn-container\">\n        <div id=\"main-search-btn\" class=\"search-btn\">\n            Jimmy Search\n        </div>\n        <div id=\"lucky-search-btn\" class=\"search-btn\">\n            <div id=\"feeling-jimmy-container\">\n                <div class=\"feeling-jimmy\">I'm Feeling Jimmy</div>\n                <div class=\"feeling-jimmy\">I'm Feeling Jimmy</div>\n                <div class=\"feeling-jimmy\">I'm Feeling Jimmy</div>\n                <div class=\"feeling-jimmy\">I'm Feeling Jimmy</div>\n                <div class=\"feeling-jimmy\">I'm Feeling Jimmy</div>\n                <div class=\"feeling-jimmy\">I'm Feeling Jimmy</div>\n                <div class=\"feeling-jimmy\">I'm Feeling Jimmy</div>\n                <div class=\"feeling-jimmy\">I'm Feeling Jimmy</div>\n                <div class=\"feeling-jimmy\">I'm Feeling Jimmy</div>\n            </div>\n        </div>\n        <div id=\"promo\">\n            All proceeds fund children's\n            <a href=\"https://jlyneu.github.io/artwork/\">art education</a>\n        </div>\n    </center>\n</div>\n";
},"useData":true});

this["Templates"]["questionCards"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    <div class=\"question-card card\" data-question-id="
    + alias4(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + ">\n        <div class=\"card-title\">"
    + alias4(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"text","hash":{},"data":data}) : helper)))
    + "</div>\n        <div class=\"card-text\">Question id: "
    + alias4(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "</div>\n        <div class=\"group\">\n            <input class=\"answer-input\" data-question-id="
    + alias4(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + " type=\"text\" required maxlength=\"800\">\n            <span class=\"highlight\"></span>\n            <span class=\"bar\"></span>\n            <label>Answer</label>\n        </div>\n        <a class=\"answer-btn btn-flat\" data-question-id="
    + alias4(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + ">RESPOND</a>\n    </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.queue : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});

this["Templates"]["recentCards"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    <div class=\"question-card card\">\n        <div class=\"card-title\">"
    + alias4(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"text","hash":{},"data":data}) : helper)))
    + "</div>\n        <div class=\"card-text\">"
    + alias4(((helper = (helper = helpers.answer || (depth0 != null ? depth0.answer : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"answer","hash":{},"data":data}) : helper)))
    + "</div>\n    </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"recent-header\" class=\"result-title\">Recent Jimmy Searches</div>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.recents : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});

this["Templates"]["search"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div>\n    <div id=\"search-bar\">\n        <a class=\"image-container\" href=\"#\">\n            <img id=\"results-logo\" src="
    + alias4(((helper = (helper = helpers.logoUrl || (depth0 != null ? depth0.logoUrl : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"logoUrl","hash":{},"data":data}) : helper)))
    + ">\n        </a>\n        <div class=\"search-box-container\">\n            <div class=\"search-box-div\">\n                <input id=\"result-search-box-input\" class=\"search-box-input\" type=\"text\" placeholder=\"Ask Jimmy\" maxlength=\"255\"/>\n                <div id=\"search-button\">\n                    <svg focusable=\"false\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\">\n                        <path d=\"M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09\n                        3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5\n                        4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z\">\n                        </path>\n                    </svg>\n                </div>\n            </div>\n        </div>\n    </div>\n    <div id=\"search-results\">\n        <div class=\"result-text\">About <span id=\"num-results\">0</span> results (<span id=\"timer\">0</span> seconds) </div>\n        <div class=\"card\">\n            <div class=\"card-title search-text loading\">"
    + alias4(((helper = (helper = helpers.query || (depth0 != null ? depth0.query : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"query","hash":{},"data":data}) : helper)))
    + "</div>\n            <div class=\"card-text results\">\n                Don't worry, Jimmy is a <i>certified</i> search engine. Your results will appear here when he finishes them.<br />\n            </div>\n        </div>\n        <div id=\"recent-container\"></div>\n    </div>\n</div>\n";
},"useData":true});