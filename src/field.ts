//#region import

import { bindable, inject, InlineViewStrategy, bindingMode, NewInstance, Container, BindingEngine } from 'aurelia-framework';
import { ValidationController, validateTrigger } from 'aurelia-validation';
import { ValidationRules, ValidationRule } from 'aurelia-validatejs';
import { Record } from './record';
import { Config } from './config';
import { DataObjectFieldViewModel } from 'aurelia-editables';

//#endregion

@inject(NewInstance.of(ValidationController), Element)
export class Field {

    //#region Bindables

    @bindable options: DataObjectFieldViewModel;

    @bindable({ defaultBindingMode: bindingMode.twoWay })
    fieldValue;

    @bindable({ defaultBindingMode: bindingMode.twoWay })
    fieldModel: Field;

    @bindable({ defaultBindingMode: bindingMode.twoWay })
    record: Record;

    @bindable dataObject;

    @bindable editableClass: string = '';

    @bindable editMode: boolean = false;

    @bindable withLabel: boolean = true;

    @bindable integratedMode: boolean = false;

    //#endregion

    //#region Bindable events

    /*private _events: any = {
        'on-created': null,
        'on-bind': null,
        'on-value-changed': null,
        'on-before-validate': null,
        'on-after-validate': null
    };*/

    //#endregion

    //#region Properties

    displayValue: any;

    editorType: string;
    editorViewModel: string;

    errors: Array<any>;

    validationMode = validateTrigger.change;
    isValid = true;

    init: number = 0;

    controller: ValidationController;

    viewStrategy: InlineViewStrategy;

    inputType: string;

    pluginConfig: Config;

    element: Element;

    //#endregion

    constructor(controller: ValidationController) {
        this.controller = controller;
        this.controller.validateTrigger = validateTrigger.manual;
        this.element = Container.instance.get(Element);
        this.fieldModel = this;
        this.pluginConfig = Container.instance.get(Config);

        let locator = Container.instance.get(BindingEngine);
        locator
            .propertyObserver(this, 'isValid')
            .subscribe(this.isValidChanged.bind(this));

        this.dispatch('on-created', { viewModel: this });
    }

    //#region au events

    bind() {
        this.inputType = 'text';
        this.editorType = 'text';
        this.options.placeholder = this.options.placeholder || '';

        this.setValidation();
        this.setEditorType();
        this.setEditorViewModel();

        let template = this.options.template || "${" + 'displayValue' + "}";
        this.viewStrategy = new InlineViewStrategy(`<template>${template}</template>`);

        this.setDisplayValue();

        this.dispatch('on-bind', { viewModel: this });
    }

    //#endregion

    //#region Validation

    setValidation() {
        if (this.options.validation) {
            if (this.options.validationMode)
                this.validationMode = this.options.validationMode;

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

                rule = new ValidationRule(ruleName, ruleConfig);
                validationRules.addRule('fieldValue', rule);
            }

            validationRules.on(this);
        }
    }

    validate() {
        if (this.integratedMode !== true) {
            this.init++;
            if (this.init <= 1)
                return;
        }

        this.dispatch('on-before-validate', { viewModel: this });

        this.errors = this.controller.validate();
        this.isValid = this.errors.length === 0;

        this.dispatch('on-after-validate', { viewModel: this });
        //console.log(this.options.name, this.controller.validate(), this.isValid);
    }

    isValidChanged(newValue) {
        if (this.dataObject) {
            this.dataObject.au.controller.viewModel.setValidationStatus(this.options.name, newValue);
        }
    }

    fieldValueChanged() {
        if (this.validationMode === validateTrigger.change)
            this.validate();

        this.setDisplayValue();

        this.dispatch('on-fieldvalue-changed', { viewModel: this });
    }

    blur() {
        if (this.validationMode === validateTrigger.blur || this.integratedMode === true)
            this.validate();

        this.dispatch('on-blur', { viewModel: this });
    }

    //#endregion

    //#region Methods

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

        // looking for plugin option
        if (currentEditor) {
            this.editorViewModel = editors[this.editorType];
        }
        // fallback to default
        else {
            this.editorViewModel = editors['text'];
        }

        // custom event, if applicable
        if (this.pluginConfig.onSetEditor) {
            this.pluginConfig.onSetEditor(this);
        }
    }

    //#endregion

    //#region Events

    dispatch(name, data) {
        this.element.dispatchEvent(
            new CustomEvent(name, {
                bubbles: true,
                detail: data
            })
        );
    }

    //#endregion
}