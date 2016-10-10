//#region import

import { bindable, inject, InlineViewStrategy, bindingMode, NewInstance, Container, BindingEngine, Parent } from 'aurelia-framework';
import { ValidationRules, ValidationController, validateTrigger } from 'aurelia-validation';
import { Record, RecordValidationState } from '../../record';
import { Config } from '../../config';
import { DataObjectFieldViewModel } from 'aurelia-editables';
import {observable} from "aurelia-binding";

//#endregion

@inject(NewInstance.of(ValidationController), Element, Config, BindingEngine)
export class Field {

    //#region Bindables

    @bindable({ defaultBindingMode: bindingMode.twoWay })
    fieldValue;

    @bindable({ defaultBindingMode: bindingMode.twoWay })
    fieldModel: Field;

    @bindable({ defaultBindingMode: bindingMode.twoWay })
    record: Record;

    @bindable options: DataObjectFieldViewModel;
    @bindable dataObject;
    @bindable editableClass: string = '';
    @bindable editMode: boolean = false;
    @bindable withLabel: boolean = true;
    @bindable integratedMode: boolean = false;

    //#endregion

    //#region Properties

    element: Element;
    parent: Parent;
    viewStrategy: InlineViewStrategy;
    displayValue: any;
    inputType: string;
    editorType: string;
    editorViewModel: string;
    validationMode = validateTrigger.change;
    controller: ValidationController;
    errors: Array<any>;

    @observable()
    isValid = null;
    pluginConfig: Config;
    init: number = 0;
    validator: any;

    //#endregion

    constructor(controller: ValidationController, element: Element, config: Config, bindingEngine: BindingEngine) {
        this.controller = controller;
        this.controller.validateTrigger = validateTrigger.manual;
        this.element = element;
        this.fieldModel = this;
        this.pluginConfig = config;

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

    editModeChanged() {
        if (this.editMode === true) {
            setTimeout(() => this.validate(), 100);
        }
    }

    //#endregion

    //#region Validation

    setValidation() {
        if (this.options.validation) {
            if (this.options.validationMode)
                this.validationMode = this.options.validationMode;

            // this.options could be a deep-observed object,
            // which has an '__observers__' own property that should be skipped
            let props = Object
                .getOwnPropertyNames(this.options.validation);

            if (props.length > 0) {
                let validator: any = ValidationRules;

                for (let key of props) {
                    if (key !== '__observers__') {
                        let ruleConfig = this.options.validation[key],
                            ruleName = key;

                        validator = validator
                            .ensure('fieldValue')
                            .displayName(this.options.title || this.options.name)
                            .satisfiesRule(ruleName, ...ruleConfig)
                            .on(this);
                    }
                }

                this.validator = validator;
            }
        }
    }

    validate() {
        this.dispatch('on-before-validate', { viewModel: this });

        this.controller.validate().then(errors => {
            this.errors = errors;
            let isValid = this.errors.length === 0;

            if (this.isValid !== isValid && this.options && this.record && this.record.setValidationStatus) {
                this.isValid = isValid;

                this.record.setValidationStatus(this.options.name,
                    (this.isValid === true ? RecordValidationState.valid : RecordValidationState.invalid))
                    .then(() => {
                        this.dispatch('on-after-validate', {viewModel: this});
                    });
            }



        });
    }

    fieldValueChanged(newVal, oldVal) {
        if (this.editMode === true) {
            this.validate();
        }

        this.setDisplayValue();

        this.dispatch('on-fieldvalue-changed', { viewModel: this });
    }

    blur() {
        this.dispatch('on-blur', { viewModel: this });
    }

    //#endregion

    //#region Methods

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

        // default display templates for different field types
        switch (this.editorType) {
            case 'icon':
                this.options.template = this.options.template || '<i class.bind="fieldValue"></i>';
                this.editorType = 'text';
                break;
            case 'boolean':
                this.options.template = this.options.template ||
                    '<input if.bind="fieldValue === true" type="checkbox" checked.bind="fieldValue" disabled />';
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
