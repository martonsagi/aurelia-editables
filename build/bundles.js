module.exports = {
  "bundles": {
    "dist/aurelia-editables.min": {
      "includes": [
        "[**/*.js]",
        "**/*.html!text",
        "**/*.css!text"
      ],
      "options": {
        "inject": true,
        "minify": true,
        "depCache": true,
        "rev": false
      }
    },
    "app/dist/aurelia-editables.deps.min": {
      "includes": [
        "bluebird",
        "css",
        "text",
        "aurelia-framework",
        "aurelia-templating-binding",
        "aurelia-templating-resources",
        "aurelia-validation",
        "aurelia-validatejs",
        "aurelia-http-client",
        "bootstrap",
        "interact.js",
        "font-awesome/css/font-awesome.min.css!text",
        "daneden/animate.css/animate.min.css!text",
        "jquery",
        "lodash"
      ],
      "options": {
        "inject": true,
        "minify": true,
        "depCache": false,
        "rev": false
      }
    }
  }
};
