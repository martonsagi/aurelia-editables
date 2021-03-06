# Aurelia-editables plugin

Table of Contents



#### The Configuration Object
Our holy grail, containing all the settings for our components. It is commonly used by all components making it possible to use them as lego-parts anywhere.
The config contains a set of definitions for fields, backend-connection, parent-child relations, etc.

For example:
```json
[
  {
    "name": "translation",
    "api": "/table/core/translation",
    "title": "Translations",
    "titleIcon": null,
    "editing": true,
    "sorting": true,
    "grouping": null,
    "filtering": true,
    "paging": {
      "paging": null,
      "size": 10
    },
    "toolbar": null,
    "form": {
      "toolbar": {
        "paging": null,
        "size": null
      },
      "groups": [],
      "cols": null
    },
    "columns": [
      {
        "name": "LanguageCode",
        "title": "Code",
        "type": "text",
        "format": null,
        "template": null,
        "hide": null,
        "hideOnForm": null,
        "filter": {
          "api": null,
          "values": null,
          "template": null
        },
        "editor": {
          "api": "/table/core/language/dropdown/Code/Name",
          "values": null,
          "type": "dropdown"
        },
        "validation": {},
        "validationMode": null,
        "placeholder": null,
        "groupId": null,
        "width": null
      },
      {
        "name": "Name",
        "title": "Name",
        "type": "text",
        "format": null,
        "template": null,
        "hide": null,
        "hideOnForm": null,
        "filter": {
          "api": null,
          "values": null,
          "template": null
        },
        "editor": {
          "api": null,
          "values": null,
          "type": "text"
        },
        "validation": {},
        "validationMode": null,
        "placeholder": null,
        "groupId": null,
        "width": null
      },
      {
        "name": "Value",
        "title": "Value",
        "type": "text",
        "format": null,
        "template": null,
        "hide": null,
        "hideOnForm": null,
        "filter": {
          "api": null,
          "values": null,
          "template": null
        },
        "editor": {
          "api": null,
          "values": null,
          "type": "text"
        },
        "validation": {},
        "validationMode": null,
        "placeholder": null,
        "groupId": null,
        "width": null
      }
    ],
    "children": [],
    "childOptions": null
  }
]
```
