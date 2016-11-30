# jimmy-as-a-service

## Getting Started

```bash
npm install
grunt build
```

Don't have grunt installed?
```bash
npm install -g grunt-cli
```

## Development Notes

### Handlebars

Currently, the HTML mainly consists of [Handlebars](http://handlebarsjs.com/)
templates. These templates live in the `/templates` directory. They are compiled
and placed into the `/js/templates.js` file when the `grunt build` command is run.
Therefore, if you make a change to any of the .hbs files and don't run this
command, then you won't see your changes locally. Alternatively, you can
run `grunt watch` and grunt will automatically compile the Handlebars templates
whenever you save a template file. This saves you from having to run `grunt build`
each time you want to see your changes.

## Hosting for local Development

In order to develop locally with the server component, see the README
for [jimmify-server](https://github.com/jimmified/jimmify-server) to learn
how to have the Go server host the static web files.
