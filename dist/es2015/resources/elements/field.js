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
import { bindable, inject, InlineViewStrategy, bindingMode, NewInstance, Container, BindingEngine } from 'aurelia-framework';
import { ValidationRules, ValidationController, validateTrigger } from 'aurelia-validation';
import { Record } from '../../record';
import { Config } from '../../config';
export let Field = class Field {
    constructor(controller) {
        this.editableClass = '';
        this.editMode = false;
        this.withLabel = true;
        this.integratedMode = false;
        this.validationMode = validateTrigger.change;
        this.isValid = true;
        this.init = 0;
        this.controller = controller;
        this.controller.validateTrigger = validateTrigger.manual;
        this.element = Container.instance.get(Element);
        this.fieldModel = this;
        this.pluginConfig = Container.instance.get(Config);
        let locator = Container.instance.get(BindingEngine);
        locator.propertyObserver(this, 'isValid').subscribe(this.isValidChanged.bind(this));
        this.dispatch('on-created', { viewModel: this });
    }
    bind() {
        this.inputType = 'text';
        this.editorType = 'text';
        this.options.placeholder = this.options.placeholder || '';
        this.setValidation();
        this.setEditorType();
        this.setEditorViewModel();
        let template = this.options.template || "${" + 'displayValue' + "}";
        this.viewStrategy = new InlineViewStrategy(`<template>${ template }</template>`);
        this.setDisplayValue();
        this.dispatch('on-bind', { viewModel: this });
    }
    setValidation() {
        if (this.options.validation) {
            if (this.options.validationMode) this.validationMode = this.options.validationMode;
            let validationRules = ValidationRules.ensure('fieldValue'),
                props = Object.getOwnPropertyNames(this.options.validation);
            for (let key of props) {
                let ruleConfig = this.options.validation[key],
                    ruleName = key,
                    rule;
                switch (key) {
                    case 'required':
                        ruleName = 'presence';
                        break;
                }
            }
        }
    }
    validate() {
        if (this.integratedMode !== true) {
            this.init++;
            if (this.init <= 1) return;
        }
        this.dispatch('on-before-validate', { viewModel: this });
        this.controller.validate().then(errors => {
            this.errors = errors;
            this.isValid = this.errors.length === 0;
            this.dispatch('on-after-validate', { viewModel: this });
        });
    }
    isValidChanged(newValue) {
        if (this.dataObject) {
            this.dataObject.au.controller.viewModel.setValidationStatus(this.options.name, newValue);
        }
    }
    fieldValueChanged() {
        if (this.validationMode === validateTrigger.change) this.validate();
        this.setDisplayValue();
        this.dispatch('on-fieldvalue-changed', { viewModel: this });
    }
    blur() {
        if (this.validationMode === validateTrigger.blur || this.integratedMode === true) this.validate();
        this.dispatch('on-blur', { viewModel: this });
    }
    setEditMode() {
        this.editMode = !this.editMode;
    }
    setDisplayValue() {
        this.displayValue = this.fieldValue;
        switch (this.editorType) {
            case 'dropdown':
                let check = this.options.editor.values ? this.options.editor.values.find(f => f.value == this.fieldValue) : null;
                this.displayValue = check ? check.text : this.fieldValue;
                break;
        }
    }
    setEditorType() {
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
    }
    setEditorViewModel() {
        let editors = this.pluginConfig.editors,
            currentEditor = this.editorType in editors;
        if (currentEditor) {
            this.editorViewModel = editors[this.editorType];
        } else {
            this.editorViewModel = editors['text'];
        }
        if (this.pluginConfig.onSetEditor) {
            this.pluginConfig.onSetEditor(this);
        }
    }
    dispatch(name, data) {
        this.element.dispatchEvent(new CustomEvent(name, {
            bubbles: true,
            detail: data
        }));
    }
};
__decorate([bindable, __metadata('design:type', Object)], Field.prototype, "options", void 0);
__decorate([bindable({ defaultBindingMode: bindingMode.twoWay }), __metadata('design:type', Object)], Field.prototype, "fieldValue", void 0);
__decorate([bindable({ defaultBindingMode: bindingMode.twoWay }), __metadata('design:type', Field)], Field.prototype, "fieldModel", void 0);
__decorate([bindable({ defaultBindingMode: bindingMode.twoWay }), __metadata('design:type', Record)], Field.prototype, "record", void 0);
__decorate([bindable, __metadata('design:type', Object)], Field.prototype, "dataObject", void 0);
__decorate([bindable, __metadata('design:type', String)], Field.prototype, "editableClass", void 0);
__decorate([bindable, __metadata('design:type', Boolean)], Field.prototype, "editMode", void 0);
__decorate([bindable, __metadata('design:type', Boolean)], Field.prototype, "withLabel", void 0);
__decorate([bindable, __metadata('design:type', Boolean)], Field.prototype, "integratedMode", void 0);
Field = __decorate([inject(NewInstance.of(ValidationController), Element), __metadata('design:paramtypes', [ValidationController])], Field);