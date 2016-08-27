var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", 'aurelia-framework', './record', 'lodash'], function (require, exports, aurelia_framework_1, record_1, _) {
    "use strict";
    var DataForm = (function () {
        function DataForm(element) {
            this.integratedMode = false;
            this.showToolbar = false;
            this.isValid = true;
            this.validationStatus = {};
            this.element = element;
            this.dispatch('on-created', { viewModel: this });
        }
        DataForm.prototype.bind = function (context) {
            this.parent = context;
            this.dispatch('on-bind', { viewModel: this, context: context });
        };
        DataForm.prototype.attached = function () {
            var currentGroups = this.options.form && this.options.form.groups && this.options.form.groups.length > 0 ?
                this.options.form.groups : null;
            this.groups = [];
            if (currentGroups === null) {
                this.groups.push({ id: 0, name: null, fields: this.options.columns });
                this.options.form.groupCols = 'col-xs-12';
            }
            else {
                var _loop_1 = function(group) {
                    var groupFields = _.filter(this_1.options.columns, function (column) { return column.groupId === group.id; });
                    this_1.groups.push({ id: group.id, name: group.name, fields: groupFields });
                };
                var this_1 = this;
                for (var _i = 0, currentGroups_1 = currentGroups; _i < currentGroups_1.length; _i++) {
                    var group = currentGroups_1[_i];
                    _loop_1(group);
                }
            }
            this.dispatch('on-attached', this);
        };
        DataForm.prototype.recordChanged = function (newVal, oldVal) {
            this.dispatch('on-record-changed', { newValue: newVal, oldValue: oldVal, viewModel: this });
        };
        DataForm.prototype.callSave = function (event) {
            this.validate();
            if (this.isValid === true) {
                if (this.parent && this.onSave) {
                    this.onSave.call(this.parent, event);
                }
            }
        };
        DataForm.prototype.callCancel = function (event) {
            if (this.parent && this.onCancel) {
                this.onCancel.call(this.parent, event);
            }
            this.validate();
        };
        DataForm.prototype.setValidationStatus = function (field, isValid) {
            this.validationStatus[field] = isValid;
            this.validate();
        };
        DataForm.prototype.validate = function () {
            this.dispatch('on-before-validate', { viewModel: this });
            this.isValid = true;
            var props = Object.getOwnPropertyNames(this.validationStatus);
            for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
                var field = props_1[_i];
                if (this.validationStatus[field] === false) {
                    this.isValid = false;
                }
            }
            this.record.isValid = this.isValid;
            this.dispatch('on-after-validate', this);
        };
        DataForm.prototype.dispatch = function (name, data) {
            this.element.dispatchEvent(new CustomEvent(name, {
                bubbles: true,
                detail: data
            }));
        };
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Object)
        ], DataForm.prototype, "options", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }), 
            __metadata('design:type', record_1.Record)
        ], DataForm.prototype, "record", void 0);
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Function)
        ], DataForm.prototype, "onSave", void 0);
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Function)
        ], DataForm.prototype, "onCancel", void 0);
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Object)
        ], DataForm.prototype, "integratedMode", void 0);
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Object)
        ], DataForm.prototype, "showToolbar", void 0);
        DataForm = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [Element])
        ], DataForm);
        return DataForm;
    }());
    exports.DataForm = DataForm;
});

//# sourceMappingURL=data-form.js.map
