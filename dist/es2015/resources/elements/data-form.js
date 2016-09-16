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
import { bindable, autoinject, bindingMode } from 'aurelia-framework';
import { Record } from '../../record';
export let DataForm = class DataForm {
    constructor(element) {
        this.integratedMode = false;
        this.showToolbar = false;
        this.isValid = true;
        this.validationStatus = {};
        this.element = element;
        this.dispatch('on-created', { viewModel: this });
    }
    bind(context) {
        this.parent = context;
        this.dispatch('on-bind', { viewModel: this, context: context });
    }
    attached() {
        let currentGroups = this.options.form && this.options.form.groups && this.options.form.groups.length > 0 ? this.options.form.groups : null;
        this.groups = [];
        if (currentGroups === null) {
            this.groups.push({ id: 0, name: null, fields: this.options.columns });
            this.options.form.groupCols = 'col-xs-12';
        } else {
            for (let group of currentGroups) {
                let groupFields = this.options.columns.filter(column => column.groupId === group.id);
                this.groups.push({ id: group.id, name: group.name, fields: groupFields });
            }
        }
        this.dispatch('on-attached', this);
    }
    recordChanged(newVal, oldVal) {
        this.dispatch('on-record-changed', { newValue: newVal, oldValue: oldVal, viewModel: this });
    }
    callSave(event) {
        this.validate();
        if (this.isValid === true) {
            if (this.parent && this.onSave) {
                this.onSave.call(this.parent, event);
            }
        }
    }
    callCancel(event) {
        if (this.parent && this.onCancel) {
            this.onCancel.call(this.parent, event);
        }
        this.validate();
    }
    setValidationStatus(field, isValid) {
        this.validationStatus[field] = isValid;
        this.validate();
    }
    validate() {
        this.dispatch('on-before-validate', { viewModel: this });
        this.isValid = true;
        let props = Object.getOwnPropertyNames(this.validationStatus);
        for (let field of props) {
            if (this.validationStatus[field] === false) {
                this.isValid = false;
            }
        }
        this.record.isValid = this.isValid;
        this.dispatch('on-after-validate', this);
    }
    dispatch(name, data) {
        this.element.dispatchEvent(new CustomEvent(name, {
            bubbles: true,
            detail: data
        }));
    }
};
__decorate([bindable, __metadata('design:type', Object)], DataForm.prototype, "options", void 0);
__decorate([bindable({ defaultBindingMode: bindingMode.twoWay }), __metadata('design:type', Record)], DataForm.prototype, "record", void 0);
__decorate([bindable, __metadata('design:type', Function)], DataForm.prototype, "onSave", void 0);
__decorate([bindable, __metadata('design:type', Function)], DataForm.prototype, "onCancel", void 0);
__decorate([bindable, __metadata('design:type', Object)], DataForm.prototype, "integratedMode", void 0);
__decorate([bindable, __metadata('design:type', Object)], DataForm.prototype, "showToolbar", void 0);
DataForm = __decorate([autoinject, __metadata('design:paramtypes', [Element])], DataForm);