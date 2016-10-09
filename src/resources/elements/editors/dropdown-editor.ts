//#region import

import { bindable, bindingMode, Container } from 'aurelia-framework';
import { Api } from '../../../api';
import { Field } from '../field';
import { DataObjectFieldEditorViewModel } from 'aurelia-editables';
import { Config } from '../../../config';

//#endregion

export class DropdownEditor {

    //#region Bindables

    @bindable({ defaultBindingMode: bindingMode.twoWay })
    field: Field;

    //#endregion

    //#region Properties

    values: Array<any>;

    api: Api;
    apiClass: any;

    pluginConfig: Config;

    loaded: boolean = false;

    //#endregion

    constructor() {
        this.pluginConfig = Container.instance.get(Config);
        this.apiClass = this.pluginConfig.api;
    }

    //#region au events

    activate(model) {
        this.field = model;
    }

    attached() {
        this.loaded = false;
        let editorSettings = <DataObjectFieldEditorViewModel>this.field.options.editor,
            displayProperty = editorSettings.displayProperty || 'text',
            valueProperty = editorSettings.displayProperty || 'value';
        let callApi = editorSettings.api !== null
                   && editorSettings.api.length > 0
                   && !editorSettings.values;

        if (!callApi) {
            this.mapValues(editorSettings.values, displayProperty, valueProperty)
                .then(result => {
                    this.values = result;
                    this.loaded = true;
                });
        } else {
            this.api = new this.apiClass(editorSettings.api);
            this.api
                .read(editorSettings.query ? editorSettings.query : {})
                .then(result => this.mapValues(result, displayProperty, valueProperty))
                .then(result => {
                    this.values = result;
                    editorSettings.values = result;
                    this.loaded = true;
                });
        }
    }

    mapValues(values: Array<any>, displayProperty: string, valueProperty: string): Promise<Array<any>> {
        return new Promise((resolve, reject) =>
        {
            let editorSettings = <DataObjectFieldEditorViewModel>this.field.options.editor;

            if (editorSettings.mapValues === true) {

                let result = [];
                for (let item of values) {
                    result.push({
                        'text': item[displayProperty],
                        'value': item[valueProperty]
                    });
                }

                resolve(result);
            } else {
                resolve(values);
            }
        });
    }

    //#endregion
}
