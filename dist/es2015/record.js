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
import { Container, BindingEngine, observable } from 'aurelia-framework';
export let Record = class Record {
    constructor(data, state) {
        this.editMode = false;
        this.validationStatus = {};
        this.validationFields = [];
        this.isValid = false;
        this.isValidationActivated = false;
        this.subscriptions = [];
        this._data = data;
        this.init = false;
        this.state = state || RecordState.unchanged;
        Object.assign(this, this._data);
        this.bindingEngine = Container.instance.get(BindingEngine);
        this.init = true;
    }
    setRecordManager(manager) {
        this.recordManager = manager;
    }
    setValidationFields(fieldNames) {
        return new Promise((resolve, reject) => {
            if (this.isValidationActivated === true) return;
            this.validationFields = fieldNames;
            let props = Object.getOwnPropertyNames(this._data);
            for (let prop of props) {
                switch (prop) {
                    default:
                        this.subscriptions.push(this.bindingEngine.propertyObserver(this, prop).subscribe(this.onChange.bind(this)));
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
        this.validate().then(() => {});
    }
    setValidationStatus(field, state) {
        return new Promise((resolve, reject) => {
            this.validationStatus[field] = state;
            this.validate().then(() => {
                resolve();
            });
        });
    }
    validate() {
        return new Promise((resolve, reject) => {
            let isValid = null;
            if (this.validationFields.length === 0) {
                resolve();
            }
            for (let field of this.validationFields) {
                if (this.validationStatus[field] !== RecordValidationState.valid) {
                    isValid = false;
                    break;
                }
            }
            this.isValid = isValid === null;
            resolve();
        });
    }
    onChange() {
        if (this.init === true && this.state === RecordState.unchanged) {
            this.state = RecordState.modified;
            if (this.recordManager) {
                this.recordManager.validate();
                if (this.recordManager.isDirty === false) {
                    this.recordManager.isDirty = true;
                }
            }
        }
    }
    isValidChanged(newVal, oldVal) {
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
    onStateChange() {}
    dispose() {
        if (this.subscriptions && this.subscriptions.length > 0) {
            for (let sub of this.subscriptions) {
                sub.dispose();
            }
        }
        this.subscriptions = [];
    }
};
__decorate([observable(), __metadata('design:type', String)], Record.prototype, "state", void 0);
__decorate([observable(), __metadata('design:type', Boolean)], Record.prototype, "editMode", void 0);
__decorate([observable(), __metadata('design:type', Object)], Record.prototype, "validationStatus", void 0);
__decorate([observable(), __metadata('design:type', Boolean)], Record.prototype, "isValid", void 0);
export const RecordState = {
    added: 'added',
    unchanged: 'unchanged',
    modified: 'modified',
    deleted: 'deleted'
};
export const RecordValidationState = {
    valid: 'valid',
    invalid: 'invalid'
};