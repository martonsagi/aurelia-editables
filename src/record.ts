//#region import

import { Container, BindingEngine, observable } from 'aurelia-framework';
import { RecordStateOptions, RecordValidationStateOptions } from 'aurelia-editables';
import { RecordManager } from './record-manager';

//#endregion

export class Record {

    //#region Properties

    init: boolean;
    state: string;
    editMode: boolean = false;

    @observable()
    validationStatus: any = {};
    validationFields: Array<string> = [];

    @observable()
    isValid: boolean = false;

    isValidationActivated: boolean = false;
    bindingEngine: BindingEngine;
    recordManager: RecordManager;

    //#endregion

    constructor(data: any, state?: string) {
        this.init = false;
        data.state = state || RecordState.unchanged;

        let props: Array<string> = Object.getOwnPropertyNames(data);
        for (let prop of props) {
            this[prop] = data[prop];
        }

        this.bindingEngine = Container.instance.get(BindingEngine);

        for (let prop of props) {
            switch (prop) {
                default:
                    this.bindingEngine
                        .propertyObserver(this, prop)
                        .subscribe(this.onChange.bind(this));
                break;
                case 'state':
                case 'editMode':
                    this.bindingEngine
                        .propertyObserver(this, prop)
                        .subscribe(this.onStateChange.bind(this));
                    break;
            }
        }

        this.init = true;
    }

    setRecordManager(manager: RecordManager) {
        this.recordManager = manager;
    }

    setValidationFields(fieldNames: Array<string>) {
        if (this.isValidationActivated === true)
            return;

        this.validationFields = fieldNames;
        for (let name of fieldNames) {
            this.validationStatus[name] = RecordValidationState.invalid;

            this.bindingEngine
                .propertyObserver(this.validationStatus, name)
                .subscribe(this.onValidationFieldsChange.bind(this));
        }

        this.isValidationActivated = true;
    }

    onValidationFieldsChange(newValue, oldValue) {
        this.validate();
    }

    setValidationStatus(field, state : string) {
        this.validationStatus[field] = state;
    }

    validate() {
        if (this.validationFields.length === 0) {
            return;
        }

        this.isValid = true;

        for (let field of this.validationFields) {
            if (this.validationStatus[field] !== RecordValidationState.valid) {
                this.isValid = false;
            }
        }
    }

    //#region Events

    onChange() {
        if (this.init === true && this.state === RecordState.unchanged) {
            this.state = RecordState.modified;
        }
    }

    isValidChanged() {
        if (this.recordManager) {
            this.recordManager.validate();
        }
    }

    onStateChange() {
    }

    //#endregion
}

export const RecordState: RecordStateOptions = {
    added: 'added',
    unchanged: 'unchanged',
    modified: 'modified',
    deleted: 'deleted'
};

export const RecordValidationState: RecordValidationStateOptions = {
    valid: 'valid',
    invalid: 'invalid'
};
