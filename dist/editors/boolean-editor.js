var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", 'aurelia-framework', '../field'], function (require, exports, aurelia_framework_1, field_1) {
    "use strict";
    var BooleanEditor = (function () {
        function BooleanEditor() {
        }
        BooleanEditor.prototype.activate = function (model) {
            this.field = model;
        };
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }), 
            __metadata('design:type', field_1.Field)
        ], BooleanEditor.prototype, "field", void 0);
        return BooleanEditor;
    }());
    exports.BooleanEditor = BooleanEditor;
});

//# sourceMappingURL=boolean-editor.js.map
