package jimmifyweb

import "os/exec"

//BuildSite build the handlebars templates
func BuildSite() {
	exec.Command("npm install")
	exec.Command("grunt build")
}
