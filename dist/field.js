var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", 'aurelia-framework', 'aurelia-validation', 'aurelia-validatejs', './record', './config'], function (require, exports, aurelia_framework_1, aurelia_validation_1, aurelia_validatejs_1, record_1, config_1) {
    "use strict";
    var Field = (function () {
        function Field(controller) {
            this.editableClass = '';
            this.editMode = false;
            this.withLabel = true;
            this.integratedMode = false;
            this.validationMode = aurelia_validation_1.validateTrigger.change;
            this.isValid = true;
            this.init = 0;
            this.controller = controller;
            this.controller.validateTrigger = aurelia_validation_1.validateTrigger.manual;
            this.element = aurelia_framework_1.Container.instance.get(Element);
            this.fieldModel = this;
            this.pluginConfig = aurelia_framework_1.Container.instance.get(config_1.Config);
            var locator = aurelia_framework_1.Container.instance.get(aurelia_framework_1.BindingEngine);
            locator
                .propertyObserver(this, 'isValid')
                .subscribe(this.isValidChanged.bind(this));
            this.dispatch('on-created', { viewModel: this });
        }
        Field.prototype.bind = function () {
            this.inputType = 'text';
            this.editorType = 'text';
            this.options.placeholder = this.options.placeholder || '';
            this.setValidation();
            this.setEditorType();
            this.setEditorViewModel();
            var template = this.options.template || "${" + 'displayValue' + "}";
            this.viewStrategy = new aurelia_framework_1.InlineViewStrategy("<template>" + template + "</template>");
            this.setDisplayValue();
            this.dispatch('on-bind', { viewModel: this });
        };
        Field.prototype.setValidation = function () {
            if (this.options.validation) {
                if (this.options.validationMode)
                    this.validationMode = this.options.validationMode;
                var validationRules = aurelia_validatejs_1.ValidationRules.ensure('fieldValue'), props = Object.getOwnPropertyNames(this.options.validation);
                for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
                    var key = props_1[_i];
                    var ruleConfig = this.options.validation[key], ruleName = key, rule = void 0;
                    switch (key) {
                        case 'required':
                            ruleName = 'presence';
                            break;
                    }
                    rule = new aurelia_validatejs_1.ValidationRule(ruleName, ruleConfig);
                    validationRules.addRule('fieldValue', rule);
                }
                validationRules.on(this);
            }
        };
        Field.prototype.validate = function () {
            if (this.integratedMode !== true) {
                this.init++;
                if (this.init <= 1)
                    return;
            }
            this.dispatch('on-before-validate', { viewModel: this });
            this.errors = this.controller.validate();
            this.isValid = this.errors.length === 0;
            this.dispatch('on-after-validate', { viewModel: this });
        };
        Field.prototype.isValidChanged = function (newValue) {
            if (this.dataObject) {
                this.dataObject.au.controller.viewModel.setValidationStatus(this.options.name, newValue);
            }
        };
        Field.prototype.fieldValueChanged = function () {
            if (this.validationMode === aurelia_validation_1.validateTrigger.change)
                this.validate();
            this.setDisplayValue();
            this.dispatch('on-fieldvalue-changed', { viewModel: this });
        };
        Field.prototype.blur = function () {
            if (this.validationMode === aurelia_validation_1.validateTrigger.blur || this.integratedMode === true)
                this.validate();
            this.dispatch('on-blur', { viewModel: this });
        };
        Field.prototype.setEditMode = function () {
            this.editMode = !this.editMode;
        };
        Field.prototype.setDisplayValue = function () {
            var _this = this;
            this.displayValue = this.fieldValue;
            switch (this.editorType) {
                case 'dropdown':
                    var check = this.options.editor.values ? this.options.editor.values.find(function (f) { return f.value == _this.fieldValue; }) : null;
                    this.displayValue = check ? check.text : this.fieldValue;
                    break;
            }
        };
        Field.prototype.setEditorType = function () {
            if ("type" in this.options && this.options.type) {
                this.editorType = this.options.type;
            }
            if ("editor" in this.options && "type" in this.options.editor && this.options.editor.type) {
                this.editorType = this.options.editor.type;
            }
            switch (this.editorType) {
                case 'icon':
                    this.options.template = '<i class.bind="fieldValue"></i>';
                    this.editorType = 'text';
                    break;
                case 'boolean':
                    this.options.template = '<input if.bind="fieldValue === true" type="checkbox" checked.bind="fieldValue" disabled />';
                    break;
                case 'number':
                    this.editorType = 'text';
                    this.inputType = 'number';
                    break;
                case 'password':
                    this.editorType = 'text';
                    this.inputType = 'password';
                    break;
            }
        };
        Field.prototype.setEditorViewModel = function () {
            var editors = this.pluginConfig.editors, currentEditor = this.editorType in editors;
            if (currentEditor) {
                this.editorViewModel = editors[this.editorType];
            }
            else {
                this.editorViewModel = editors['text'];
            }
            if (this.pluginConfig.onSetEditor) {
                this.pluginConfig.onSetEditor(this);
            }
        };
        Field.prototype.dispatch = function (name, data) {
            this.element.dispatchEvent(new CustomEvent(name, {
                bubbles: true,
                detail: data
            }));
        };
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Object)
        ], Field.prototype, "options", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }), 
            __metadata('design:type', Object)
        ], Field.prototype, "fieldValue", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }), 
            __metadata('design:type', Field)
        ], Field.prototype, "fieldModel", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }), 
            __metadata('design:type', record_1.Record)
        ], Field.prototype, "record", void 0);
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Object)
        ], Field.prototype, "dataObject", void 0);
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', String)
        ], Field.prototype, "editableClass", void 0);
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Boolean)
        ], Field.prototype, "editMode", void 0);
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Boolean)
        ], Field.prototype, "withLabel", void 0);
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Boolean)
        ], Field.prototype, "integratedMode", void 0);
        Field = __decorate([
            aurelia_framework_1.inject(aurelia_framework_1.NewInstance.of(aurelia_validation_1.ValidationController), Element), 
            __metadata('design:paramtypes', [aurelia_validation_1.ValidationController])
        ], Field);
        return Field;
    }());
    exports.Field = Field;
});

//# sourceMappingURL=field.js.map
