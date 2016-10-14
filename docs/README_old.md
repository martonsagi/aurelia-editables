# aurelia-editables

> Aurelia-editables is a configuration-based data editor plugin for [Aurelia](http://aurelia.io/) with built-in [validation](http://github.com/aurelia/validation) and [localization](http://github.com/aurelia/i18n) support. It provides an easy solution for creating editable datagrids and forms.

With aurelia-editables you can:

* create datagrids with remote data, filtering, master-detail connections and many more..., 
* create standalone or datagrid-integrated forms,
* or just create standalone input fields

  
## Demo
TODO: Showcase and more examples 

## Main Components:

| Name | Tag | Description |
| ---- | --- | ----------- |
| DataGrid | `<data-grid>` | Editable DataGrid, generated based on a configuration object |
| MultiGrid | `<multi-grid>` | Tabbed view generated based on an array of configuration objects |
| DataForm | `<data-form>` | Editable form, generated based on the same configuration as DataGrids |
| Field | `<field>` | Basic data editor component |

## Concepts
Main goal: creating configurable and reusable widgets for data manipulation that can make our life easier while developing admin apps.

Average data editing scenarios can be described in the same abstract way

* **List view**: there is a list or table, which provides a basic view with many records at the same time 
* **Card view**: from the list view one usually can navigate to a form with editable fields, which provides a detailed view for one record
* **Input field**: whether it be a table cell or an editable input, it contains an atomic piece of information (a record field)
* **Data row**: it can be a content of an actual database row or any custom designed viewmodel, from a frontend point of view, it's just an object with many data fields.

### Breaking it down
Based on above, we are able to break it down to atomic elements:

#### Record
A data row represented as an object, which stores an isolated set of data and tracks any changes.

* It contains any data field related to our activities
* It is usually the backend's responsibility to provide the coresponding data, but we also be able to create local data manually
* While it's mostly just data, also stores the overall validation state of its fields.  

#### Field
It uses a property of the Record object to display and is responsible for formatting, editing, validation and localization.
* This very same component is being reused in datagrids and dataforms
* There are two operational modes: readonly (display) mode / editable mode

#### DataForm
This is a collection of readonly/editable Field components, bound to a single Record object.
It can have field groups to display logically connected Fields together. Bootstrap's `col-*` classes can also be used for controlling the overall form layout. 

#### DataGrid
It displays a set of Records, represented with a table layout. Table cells consist of Field components. A DataForm component can also be attached to the selected Record.
To embrace the real power of custom components, related DataGrids can be nested as child DataGrid(s) down to an infinite level. (Nested child grid has a child, and so on.. :-)
If more then one child Grids are present, it will be displayed with tabbed layout (similiar to MultiGrid). 

#### MultiGrid
It displays several logically connected DataGrids, represented with a tabbed layout. Each DataGrid has its own tab.

#### The Configuration Object
Our holy grail, containing all the settings for our components. It is commonly used by all components making it possible to use them as lego-parts anywhere.
The config contains a set of definitions for fields, backend-connection, parent-child relations, etc.

Simplified sematic view of DataGrid/DataForm configuration objects:
```
<grid-definition> {
    <base-attributes>
    <form-options>
    <columns>: [
        <field-definition>,
        <field-definition>
    ]
    <children>: [
        <grid-definition>,
        <grid-definition>
    ]
    <child-options>
}

```

Based on above, a similiar view of Field configuration objects. It is the integral part of any DataGrid/DataForm config, but it can be used with standalone Fields as well. 
```
<field-definition> {
    <base-attributes>,
    <filter-options>
    <editor-options>,
    <validation-options>
}
```

MultiGrid configuration is simply an array of DataGrid configs objects:
```
[
    <grid-definition>,
    <grid-definition>,
    <grid-definition> 
]
```

Full example here: [config.example.json](./docs/config.example.json)

## Installation

Run `jspm install npm:aurelia-editables`

This plugin has several resources other than the main javascript file, so we'll need a bit of additional tweaking for correct bundling. Add this code below to the corresponding (`bundles.dist/aurelia.includes` or similar) section of `build/bundles.js`.

```js
"aurelia-editables",
"aurelia-editables/**/*.js",
"aurelia-editables/**/*.html!text",
"aurelia-editables/**/*.css!text",
```

### Setting up localization

i18n-xhr-backend is being used by default to load translation files from the server. Up until this moment, I haven't found any solution to load these files directly from the plugin's installation folder. For now,  `jspm_packages/npm/aurelia-editables@version>/locales` folder should be copied to your configured path (by default to `<wwwroot>/`) in order to make it work.


### Setting up dev. environment
After downloading / forking this repo, an `npm install` will do the initial steps. Presuming you've managed to escape from the gates of dependency hell unleashed by npm, do these steps:

* `typings install` - set up TypeScript definitions:   
* `gulp build` - build the project with 
* `gulp watch` - use it for automatic rebuild
* I would recommend to install `jspm-local` or `jspm-fs` for testing with local package installation
* Happy coding! :) 

### Dependency stuff
A few, but not overwhelming yet:

* aurelia-validation
* aurelia-i18n
* lodash
* interact.js (for column resizing)
* bootstrap css + js (therefore + jQuery)
* font-awesome
* less


## Usage

Register plugin in your `main.js`. It will configure all resources, no additional `<require>` tags will be necessary in the views.

Default configuration...
```js
aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-editables');
```

...or customized configuration
```js
aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-editables', (config: i18nSetup) => {
        // replace default remote data connector
        config.api = MyOwnApiClass;     
        
        // replace existing editor templates 
        config.editors['text'] = './custom/text-editor';
        
        // register additional editor templates 
        config.editors['datepicker'] = './custom/date-picker';

        // change i18n defaults
        config.onSeti18n = (setup: i18nSetup) => {
            setup.lng = 'de';
        };
    });
```

### Usage in views:

MultiGrid:
```html
<multi-grid options.bind="gridOptions"></multi-grid>
```

DataGrid:
```html
<data-grid options.bind="gridOptions"></data-grid>
```

DataForm:
```html
<data-form options.bind="gridOptions" record.bind="currentRecord"></data-form>
```

Standalone Fields:
```html
<field options.bind="fieldOptions"
       integrated-mode.bind="false"
       edit-mode.bind="true"
       field-value.bind="item[fieldOptions.name]"
       record.bind="item"
       with-label.bind="true" />
```


#### Events

There are a bunch of bindable events available for all components. Usually, the viewModel instance can be accessed through the `viewModel` property of any `$event.detail` object.


DataForm source:
```js
this.dispatch('on-created', { viewModel: this });
```

Usage in template (my-view-model.html):
```html
<template>
    <data-form on-created.delegate="myEvent($event)"></data-form>
</template>
```

Usage in viewmodel (my-view-model.js):
```js
export class MyViewModel {
    ...
    
    myEvent(event) {
        console.log(event.detail.viewModel);
    }
    
    ...
}
```


### TypeScript definitions

Corresponding .d.ts files are available in the `typings_custom` folder.
