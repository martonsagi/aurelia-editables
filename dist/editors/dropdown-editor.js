var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", 'aurelia-framework', '../field', '../config'], function (require, exports, aurelia_framework_1, field_1, config_1) {
    "use strict";
    var DropdownEditor = (function () {
        function DropdownEditor() {
            this.pluginConfig = aurelia_framework_1.Container.instance.get(config_1.Config);
            this.apiClass = this.pluginConfig.api;
        }
        DropdownEditor.prototype.activate = function (model) {
            this.field = model;
        };
        DropdownEditor.prototype.attached = function () {
            var t = this;
            var editorSettings = this.field.options.editor;
            var callApi = editorSettings.api !== null
                && editorSettings.api.length > 0
                && !editorSettings.values;
            if (!callApi) {
                this.values = editorSettings.values;
            }
            else {
                this.api = new this.apiClass(editorSettings.api);
                this.api.get().then(function (result) {
                    t.values = result;
                    editorSettings.values = result;
                });
            }
        };
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }), 
            __metadata('design:type', field_1.Field)
        ], DropdownEditor.prototype, "field", void 0);
        return DropdownEditor;
    }());
    exports.DropdownEditor = DropdownEditor;
});

//# sourceMappingURL=dropdown-editor.js.map
