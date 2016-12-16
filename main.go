package jimmifyweb

import (
	"errors"
	"os"
	"os/exec"
)

//BuildSite build the handlebars templates
func BuildSite() (string, error) {
	working, _ := os.Getwd() // Get os working directory
	//get path to static site
	path := os.Getenv("GOPATH") + "/src/github.com/jimmified/jimmify-web/"
	os.Chdir(path) // change dir to static site
	//run npm
	npm := exec.Command("npm", "install")
	err := npm.Run()
	if err != nil {
		os.Chdir(working) // change dir back to working directory
		return path, errors.New("Jimmify Web: could not run npm install")
	}
	grunt := exec.Command("grunt", "build")
	err = grunt.Run()
	if err != nil {
		os.Chdir(working) // change dir back to working directory
		return path, errors.New("Jimmify Web: could not run grunt build")
	}
	os.Chdir(working) // change dir back to working directory
	return path, nil
}
