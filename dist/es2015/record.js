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
        this.init = false;
        data.state = state || RecordState.unchanged;
        let props = Object.getOwnPropertyNames(data);
        for (let prop of props) {
            this[prop] = data[prop];
        }
        this.bindingEngine = Container.instance.get(BindingEngine);
        for (let prop of props) {
            switch (prop) {
                default:
                    this.bindingEngine.propertyObserver(this, prop).subscribe(this.onChange.bind(this));
                    break;
                case 'state':
                case 'editMode':
                    this.bindingEngine.propertyObserver(this, prop).subscribe(this.onStateChange.bind(this));
                    break;
            }
        }
        this.init = true;
    }
    setRecordManager(manager) {
        this.recordManager = manager;
    }
    setValidationFields(fieldNames) {
        if (this.isValidationActivated === true) return;
        this.validationFields = fieldNames;
        for (let name of fieldNames) {
            this.validationStatus[name] = RecordValidationState.invalid;
            this.bindingEngine.propertyObserver(this.validationStatus, name).subscribe(this.onValidationFieldsChange.bind(this));
        }
        this.isValidationActivated = true;
    }
    onValidationFieldsChange(newValue, oldValue) {
        this.validate();
    }
    setValidationStatus(field, state) {
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
    onStateChange() {}
};
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