var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = this && this.__metadata || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { bindable, bindingMode, Container } from 'aurelia-framework';
import { Field } from '../field';
import { Config } from '../../../config';
export let DropdownEditor = class DropdownEditor {
    constructor() {
        this.pluginConfig = Container.instance.get(Config);
        this.apiClass = this.pluginConfig.api;
    }
    activate(model) {
        this.field = model;
    }
    attached() {
        let t = this;
        let editorSettings = this.field.options.editor;
        let callApi = editorSettings.api !== null && editorSettings.api.length > 0 && !editorSettings.values;
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
};
__decorate([bindable({ defaultBindingMode: bindingMode.twoWay }), __metadata('design:type', Field)], DropdownEditor.prototype, "field", void 0);