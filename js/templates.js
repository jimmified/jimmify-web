this["Templates"] = this["Templates"] || {};

this["Templates"]["main"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<img id=\"logo\" src="
    + container.escapeExpression(((helper = (helper = helpers.logoUrl || (depth0 != null ? depth0.logoUrl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"logoUrl","hash":{},"data":data}) : helper)))
    + "></img>\n<div id=\"search-box-container\">\n    <input id=\"search-box\" type=\"text\" placeholder=\"Ask Jimmy\" keyup=\"makeSearch\"/>\n</div>\n<center id=\"search-btn-container\">\n    <div id=\"main-search-btn\" class=\"search-btn\">\n        Jimmy Search\n    </div>\n    <div id=\"lucky-search-btn\" class=\"search-btn\">\n        I'm Feeling Jimmy\n    </div>\n    <div id=\"promo\">\n        All proceeds fund children's\n        <a href=\"https://jlyneu.github.io/artwork/\">art education</a>\n    </div>\n</center>\n<div id=\"footer\"></div>\n";
},"useData":true});

this["Templates"]["search"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div id=\"search-bar\">\n    <a class=\"image-container\" href=\"#\">\n        <img id=\"results-logo\" src="
    + container.escapeExpression(((helper = (helper = helpers.logoUrl || (depth0 != null ? depth0.logoUrl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"logoUrl","hash":{},"data":data}) : helper)))
    + ">\n    </a>\n    <div id=\"search-box-container\">\n        <input id=\"search-box\" type=\"text\" placeholder=\"Ask Jimmy\"/>\n        <button id=\"search-button\">\n            <span class=\"mag-glass\"></span>\n        </button>\n    </div>\n</div>\n<div id=\"search-results\">\n</div>\n";
},"useData":true});