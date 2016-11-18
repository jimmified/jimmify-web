this["Templates"] = this["Templates"] || {};

this["Templates"]["admin"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"material-body\">\n    <div style=\"background: #039BE5;\" id=\"hero\">\n        <div id=\"title-bar\">\n            <div>\n                <h1>Jimmy Console</h1>\n                <h2 id=\"subtitle\">Preach to the people</h2>\n            </div>\n        </div>\n    </div>\n</div>\n<div id=\"page-wrap\">\n    <div class=\"card\">\n        <div class=\"card-title\">Server Base URL</div>\n        <div class=\"card-text\">Provide the base URL for requests to the jimmified-server, i.e. http://localhost:3000</div>\n        <div class=\"group\">\n            <input id=\"server-base-url\" type=\"text\" required>\n            <span class=\"highlight\"></span>\n            <span class=\"bar\"></span>\n            <label>Base URL</label>\n        </div>\n    </div>\n    <div class=\"card\">\n        <div class=\"card-title\">TurboJim AnswerXchange</div>\n        <div class=\"card-text\">After you provide a URL for the server, go get some questions to answer!</div>\n        <a id=\"admin-get-questions\" class=\"btn-flat\">GET QUESTIONS</a>\n    </div>\n    <div id=\"question-list\">\n    </div>\n</div>\n";
},"useData":true});

this["Templates"]["main"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"min-width-container\">\n    <img id=\"logo\" src="
    + container.escapeExpression(((helper = (helper = helpers.logoUrl || (depth0 != null ? depth0.logoUrl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"logoUrl","hash":{},"data":data}) : helper)))
    + "></img>\n    <div id=\"search-box-container\">\n        <input id=\"search-box\" type=\"text\" placeholder=\"Ask Jimmy\"/>\n    </div>\n    <center id=\"search-btn-container\">\n        <div id=\"main-search-btn\" class=\"search-btn\">\n            Jimmy Search\n        </div>\n        <div id=\"lucky-search-btn\" class=\"search-btn\">\n            I'm Feeling Jimmy\n        </div>\n        <div id=\"promo\">\n            All proceeds fund children's\n            <a href=\"https://jlyneu.github.io/artwork/\">art education</a>\n        </div>\n    </center>\n    <div id=\"footer\"></div>\n</div>\n";
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
    + " type=\"text\" required>\n            <span class=\"highlight\"></span>\n            <span class=\"bar\"></span>\n            <label>Answer</label>\n        </div>\n        <a class=\"answer-btn btn-flat\" data-question-id="
    + alias4(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + ">RESPOND</a>\n    </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.queue : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});

this["Templates"]["search"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"min-width-container\">\n    <div id=\"search-bar\">\n        <a class=\"image-container\" href=\"#\">\n            <img id=\"results-logo\" src="
    + container.escapeExpression(((helper = (helper = helpers.logoUrl || (depth0 != null ? depth0.logoUrl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"logoUrl","hash":{},"data":data}) : helper)))
    + ">\n        </a>\n        <div id=\"search-box-container\">\n            <input id=\"search-box\" type=\"text\" placeholder=\"Ask Jimmy\"/>\n            <button id=\"search-button\">\n                <span class=\"mag-glass\"></span>\n            </button>\n        </div>\n    </div>\n    <div id=\"search-results\">\n    </div>\n</div>\n";
},"useData":true});