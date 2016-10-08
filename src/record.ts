//#region import

import { Container, BindingEngine, observable, Disposable } from 'aurelia-framework';
import { RecordStateOptions, RecordValidationStateOptions } from 'aurelia-editables';
import { RecordManager } from './record-manager';

//#endregion

export class Record implements Disposable {

    //#region Properties

    private _data: any;

    init: boolean;

    @observable()
    state: string;

    @observable()
    editMode: boolean = false;

    @observable()
    validationStatus: any = {};
    validationFields: Array<string> = [];

    @observable()
    isValid: boolean = false;

    isValidationActivated: boolean = false;
    bindingEngine: BindingEngine;
    recordManager: RecordManager;

    subscriptions: Array<Disposable> = [];

    //#endregion

    constructor(data: any, state?: string) {
        this._data = data;
        this.init = false;
        this.state = state || RecordState.unchanged;

        Object.assign(this, this._data);

        this.bindingEngine = Container.instance.get(BindingEngine);

        this.init = true;
    }

    setRecordManager(manager: RecordManager) {
        this.recordManager = manager;
    }

    /**
     *
     * This function initializes property observation and validation features
     *
     * Performance consideration:
     * It will only be triggered one time when a record becomes a subject of add/edit operation
     *
     * @param fieldNames Array<string> property names which have validation
     */
    setValidationFields(fieldNames: Array<string>) {
        return new Promise((resolve, reject) => {
            if (this.isValidationActivated === true)
                return;

            this.validationFields = fieldNames;
            for (let name of fieldNames) {
                this.validationStatus[name] = RecordValidationState.invalid;

                this.subscriptions.push(
                    this.bindingEngine
                        .propertyObserver(this.validationStatus, name)
                        .subscribe(this.onValidationFieldsChange.bind(this))
                );
            }

            let props: Array<string> = Object.getOwnPropertyNames(this._data);
            for (let prop of props) {
                switch (prop) {
                    default:
                        this.subscriptions.push(
                            this.bindingEngine
                                .propertyObserver(this, prop)
                                .subscribe(this.onChange.bind(this))
                        );
                        break;
                    case "state":
                    case "editMode":
                        break;
                }
            }

            this.isValidationActivated = true;
            resolve();
        });
    }

    onValidationFieldsChange(newValue, oldValue) {
        this.validate();
    }

    setValidationStatus(field, state : string) {
        this.validationStatus[field] = state;
    }

    validate() {
        return new Promise((resolve, reject) => {
            if (this.validationFields.length === 0) {
                resolve();
            }

            this.isValid = true;

            for (let field of this.validationFields) {
                if (this.validationStatus[field] !== RecordValidationState.valid) {
                    this.isValid = false;
                }
            }

            resolve();
        });
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

    editModeChanged() {
        if (this.editMode === false) {
            this.dispose();
            this.isValidationActivated = false;
        }
    }

    onStateChange() {
    }

    dispose(): void {
        if (this.subscriptions && this.subscriptions.length > 0) {
            for (let sub of this.subscriptions) {
                sub.dispose();
            }
        }

        this.subscriptions = [];
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
