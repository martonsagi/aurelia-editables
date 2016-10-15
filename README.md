# aurelia-editables

> Aurelia-editables is a configurable data editor plugin for [Aurelia](http://aurelia.io/) with built-in [validation](http://github.com/aurelia/validation) and [localization](http://github.com/aurelia/i18n) support. It provides an easy solution for creating editable datagrids or tables and forms. This project's main goal is to provide configurable, reusable widgets for data manipulation that can make the development of admin applications easier.

With aurelia-editables you can create:

* datagrids with remote data, filtering, master-detail connections and many more..., 
* standalone or datagrid-integrated forms,
* or standalone input fields.


## Demo
@TODO: Showcase and more examples 

## Documentation
@TODO: Check out the [Github Wiki](https://github.com/martonsagi/aurelia-editables/wiki).

## 1. Installation

### 1.1 JSPM

Run `jspm install npm:aurelia-editables`

This plugin has several resources other than the main javascript file, so we'll need a bit of additional tweaking for correct bundling. Add this code below to the corresponding (`bundles.dist/aurelia.includes` or similar) section of `build/bundles.js`.

```js
"aurelia-editables",
"aurelia-editables/**/*.js",
"aurelia-editables/**/*.html!text",
"aurelia-editables/**/*.css!text",
```

### 1.2 aurelia-cli

Install via NPM

```javascript
npm install aurelia-editables --save
```

#### 1.2.1 `editables` helper task for aurelia-cli

Since aurelia-cli is still in alpha stage and `install` command is not yet implemented, I've created a custom cli task to help you with configuring plugin dependencies in `aurelia.json`. It adds a pre-configured set of dependencies to `aurelia.json`. 
A post-install npm script takes care of placing this new `editables.ts|js` task into `aurelia_project/tasks` folder.
 
**All parameters are optional**

| Optional parameters | Description |
| ------------------- | ----------- |
| --bundle, b <bundle-file.js> | Set bundle section to be modified |
| --force, f | Overwrite previously set dependencies (applies to this package's dependencies only! It won't delete the whole bundle setting.) |
| --generate, g <options> | (Not implemented yet.) Generates a Grid/Form configuration based on given parameters and saves it to a json file. |

Run `editables` helper

```
au editables [--bunde <custom-bundle-filename>] [--force]
```

**Note:** tested on Windows platform only.

#### 1.2.2 Manual bundle configuration

If you'd prefer embracing the power of `CTRL+C` over using some mysterious script, just add below section to your desired bundle section in `aurelia.json`:

```
    ...
    
    "aurelia-http-client",
    {
        "name": "jquery",
        "path": "../node_modules/jquery/dist",
        "main": "jquery.min"
    },
    {
        "name": "bootstrap",
        "path": "../node_modules/bootstrap/dist",
        "main": "js/bootstrap.min",
        "deps": ["jquery"],
        "exports": "$"
    },
    {
        "name": "i18next",
        "path": "../node_modules/i18next/dist/umd",
        "main": "i18next"
    },
    {
        "name": "aurelia-i18n",
        "path": "../node_modules/aurelia-i18n/dist/amd",
        "main": "aurelia-i18n"
    },
    {
        "name": "i18next-xhr-backend",
        "path": "../node_modules/i18next-xhr-backend/dist/umd",
        "main": "i18nextXHRBackend"
    },
    {
        "name": "aurelia-validation",
        "path": "../node_modules/aurelia-validation/dist/amd",
        "main": "aurelia-validation"
    },
    {
        "name": "aurelia-ui-virtualization",
        "path": "../node_modules/aurelia-ui-virtualization/dist/amd",
        "main": "aurelia-ui-virtualization"
    },
    {
        "name": "aurelia-editables",
        "path": "../node_modules/aurelia-editables/dist/amd",
        "main": "aurelia-editables",
        "resources": [
            "**/*.html",
            "**/*.css"
        ]
    }
    
    ...
```

### 1.3 Webpack

@TODO: provide installation steps.
I have no prior experience with webpack. Any feedback or help would be appreciated on this. 

## 2. Usage

Register plugin in your `main.js`. It will configure all resources, no additional `<require>` tags will be necessary in the views.

Default configuration...
```javascript
export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-editables'); // Add this line to load the plugin

  aurelia.start().then(a => a.setRoot());
}
```

...or customized configuration
```js
aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-editables', (config) => {
        // replace default remote data connector
        config.api = MyOwnApiClass;     
        
        // replace existing editor templates 
        config.editors['text'] = './custom/text-editor';
        
        // register additional editor templates 
        config.editors['datepicker'] = './custom/date-picker';
    });
```

### 2.1 Usage in views:

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

### 2.1 Events

There are a bunch of bindable events available for all components. Usually, the viewModel instance can be accessed through the `viewModel` property of any `$event.detail` object.

data-grid.ts source:
```js
this.dispatch('on-before-save', { viewModel: this, changes: changes });
```

Usage in template (my-view-model.html):
```html
<template>
    <data-grid on-before-save.delegate="myEvent($event)"></data-grid>
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

### 2.2 Components:

| Name | Tag | Description |
| ---- | --- | ----------- |
| DataGrid | `<data-grid>` | Editable DataGrid, generated based on a configuration object |
| MultiGrid | `<multi-grid>` | Tabbed view generated based on an array of configuration objects |
| DataForm | `<data-form>` | Editable form, generated based on the same configuration as DataGrids |
| Field | `<field>` | Basic data editor component |


### 2.3 The Configuration Object
It is commonly used by all components, which makes it possible to combine them as lego-parts.
The config contains a set of definitions for fields/columns, backend-connection, parent-child relations, etc.

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

Based on above, a similar view of Field configuration objects. It is the integral part of any DataGrid/DataForm config, but it can be used with standalone Fields as well. 
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

### 2.3 TypeScript definitions

Definition is available in `typings_custom` and `dist` folders. Package.json has been configured as well. 

## 3. Dependencies

* aurelia-validation
* aurelia-ui-virtualization
* aurelia-http-client
* aurelia-i18n
* i18n-xhr-backend
* interact.js (for column resizing)
* underscore.js
* font-awesome
* animate.css
* Bootstrap

**Notes on jQuery + Bootstrap:**
Although, this plugin is not dependent on jQuery, the basic layout has primarily designed to work with Bootstrap. 
That means no hard dependencies in this project, but your application may need to have jQuery and Bootstrap bundled.

`MultiGrid` component: 
* This is the only element, where Bootstrap Javascript is used (for tabbed layout).
* In theory, if you choose not to use `MultiGrid`, then referencing Bootstrap css only without jQuery + Bootstrap JS references could be working.
* Alternatively, you can implement your own tabbed MultiGrid-like element. 

**Support for Other UI frameworks** (not implemented)
@TODO: I have some ideas how to do that. For example, by making views replaceable via configuration or binding. 
E.g. `<data-grid layout.bind="./grid-sematic-ui.html"></data-grid>` 


## 4. Platform Support

This library can be used in the **browser** only.

## 5. Building The Code

To build the code, follow these steps.

1. Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the build tooling runs.
2. From the project folder, execute the following command:

  ```shell
  npm install
  ```
3. Ensure that [Gulp](http://gulpjs.com/) is installed. If you need to install it, use the following command:

  ```shell
  npm install -g gulp
  ```
4. To build the code, you can now run:

  ```shell
  gulp build
  ```
5. You will find the compiled code in the `dist` folder, available in three module formats: AMD, CommonJS and ES6.

6. See `gulpfile.js` for other tasks related to generating the docs and linting.

