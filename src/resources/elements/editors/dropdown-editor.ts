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
        let t = this;
        let editorSettings = <DataObjectFieldEditorViewModel>this.field.options.editor;
        let callApi = editorSettings.api !== null
                   && editorSettings.api.length > 0
                   && !editorSettings.values;

        if (!callApi) {
            this.values = editorSettings.values;
        } else {
            this.api = new this.apiClass(editorSettings.api);
            this.api.get().then(result => {
                t.values = result;
                editorSettings.values = result;
            });
        }
    }

    //#endregion
}
