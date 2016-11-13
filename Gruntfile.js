module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt)

    grunt.initConfig({
        handlebars: {
            options: {
                namespace: "Templates",
                processName: function(filePath) {
                    return filePath.replace(/^templates\//, '').replace(/\.hbs$/, '');
                }
            },
            compile: {
                files: {
                    "js/templates.js": "templates/*.hbs"
                }
            }
        },
        watch: {
            files: ["**/*.hbs"],
            tasks: ["handlebars"]
        }
    })
    grunt.registerTask("build", ["handlebars"]);
    grunt.registerTask("default", ["build"]);
};
