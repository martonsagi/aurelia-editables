var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = this && this.__metadata || function (k, v) {
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { bindable, inject, InlineViewStrategy, bindingMode, NewInstance, BindingEngine } from 'aurelia-framework';
import { ValidationRules, ValidationController, validateTrigger } from 'aurelia-validation';
import { Record, RecordValidationState } from '../../record';
import { Config } from '../../config';
import { observable } from "aurelia-binding";
export var Field = function () {
    function Field(controller, element, config, bindingEngine) {
        _classCallCheck(this, Field);

        this.editableClass = '';
        this.editMode = false;
        this.withLabel = true;
        this.integratedMode = false;
        this.validationMode = validateTrigger.change;
        this.isValid = null;
        this.init = 0;
        this.controller = controller;
        this.controller.validateTrigger = validateTrigger.manual;
        this.element = element;
        this.fieldModel = this;
        this.pluginConfig = config;
        this.dispatch('on-created', { viewModel: this });
    }

    Field.prototype.bind = function bind() {
        this.inputType = 'text';
        this.editorType = 'text';
        this.options.placeholder = this.options.placeholder || '';
        this.setValidation();
        this.setEditorType();
        this.setEditorViewModel();
        var template = this.options.template || "${" + 'displayValue' + "}";
        this.viewStrategy = new InlineViewStrategy("<template>" + template + "</template>");
        this.setDisplayValue();
        this.dispatch('on-bind', { viewModel: this });
    };

    Field.prototype.editModeChanged = function editModeChanged() {
        var _this = this;

        if (this.editMode === true) {
            setTimeout(function () {
                return _this.validate();
            }, 100);
        }
    };

    Field.prototype.setValidation = function setValidation() {
        if (this.options.validation) {
            if (this.options.validationMode) this.validationMode = this.options.validationMode;
            var props = Object.getOwnPropertyNames(this.options.validation);
            if (props.length > 0) {
                var validator = ValidationRules;
                for (var _iterator = props, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                    var _ref;

                    if (_isArray) {
                        if (_i >= _iterator.length) break;
                        _ref = _iterator[_i++];
                    } else {
                        _i = _iterator.next();
                        if (_i.done) break;
                        _ref = _i.value;
                    }

                    var key = _ref;

                    if (key !== '__observers__') {
                        var _validator$ensure$dis;

                        var ruleConfig = this.options.validation[key],
                            ruleName = key;
                        validator = (_validator$ensure$dis = validator.ensure('fieldValue').displayName(this.options.title || this.options.name)).satisfiesRule.apply(_validator$ensure$dis, [ruleName].concat(ruleConfig)).on(this);
                    }
                }
                this.validator = validator;
            }
        }
    };

    Field.prototype.validate = function validate() {
        var _this2 = this;

        this.dispatch('on-before-validate', { viewModel: this });
        this.controller.validate().then(function (errors) {
            _this2.errors = errors;
            var isValid = _this2.errors.length === 0;
            if (_this2.isValid !== isValid && _this2.options && _this2.record && _this2.record.setValidationStatus) {
                _this2.isValid = isValid;
                _this2.record.setValidationStatus(_this2.options.name, _this2.isValid === true ? RecordValidationState.valid : RecordValidationState.invalid).then(function () {
                    _this2.dispatch('on-after-validate', { viewModel: _this2 });
                });
            }
        });
    };

    Field.prototype.fieldValueChanged = function fieldValueChanged(newVal, oldVal) {
        if (this.editMode === true) {
            this.validate();
        }
        this.setDisplayValue();
        this.dispatch('on-fieldvalue-changed', { viewModel: this });
    };

    Field.prototype.blur = function blur() {
        this.dispatch('on-blur', { viewModel: this });
    };

    Field.prototype.setDisplayValue = function setDisplayValue() {
        var _this3 = this;

        this.displayValue = this.fieldValue;
        switch (this.editorType) {
            case 'dropdown':
                var check = this.options.editor.values ? this.options.editor.values.find(function (f) {
                    return f.value == _this3.fieldValue;
                }) : null;
                this.displayValue = check ? check.text : this.fieldValue;
                break;
        }
    };

    Field.prototype.setEditorType = function setEditorType() {
        if ("type" in this.options && this.options.type) {
            this.editorType = this.options.type;
        }
        if ("editor" in this.options && "type" in this.options.editor && this.options.editor.type) {
            this.editorType = this.options.editor.type;
        }
        switch (this.editorType) {
            case 'icon':
                this.options.template = this.options.template || '<i class.bind="fieldValue"></i>';
                this.editorType = 'text';
                break;
            case 'boolean':
                this.options.template = this.options.template || '<input if.bind="fieldValue === true" type="checkbox" checked.bind="fieldValue" disabled />';
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

    Field.prototype.setEditorViewModel = function setEditorViewModel() {
        var editors = this.pluginConfig.editors,
            currentEditor = this.editorType in editors;
        if (currentEditor) {
            this.editorViewModel = editors[this.editorType];
        } else {
            this.editorViewModel = editors['text'];
        }
        if (this.pluginConfig.onSetEditor) {
            this.pluginConfig.onSetEditor(this);
        }
    };

    Field.prototype.dispatch = function dispatch(name, data) {
        this.element.dispatchEvent(new CustomEvent(name, {
            bubbles: true,
            detail: data
        }));
    };

    return Field;
}();
__decorate([bindable({ defaultBindingMode: bindingMode.twoWay }), __metadata('design:type', Object)], Field.prototype, "fieldValue", void 0);
__decorate([bindable({ defaultBindingMode: bindingMode.twoWay }), __metadata('design:type', Field)], Field.prototype, "fieldModel", void 0);
__decorate([bindable({ defaultBindingMode: bindingMode.twoWay }), __metadata('design:type', Record)], Field.prototype, "record", void 0);
__decorate([bindable, __metadata('design:type', Object)], Field.prototype, "options", void 0);
__decorate([bindable, __metadata('design:type', Object)], Field.prototype, "dataObject", void 0);
__decorate([bindable, __metadata('design:type', String)], Field.prototype, "editableClass", void 0);
__decorate([bindable, __metadata('design:type', Boolean)], Field.prototype, "editMode", void 0);
__decorate([bindable, __metadata('design:type', Boolean)], Field.prototype, "withLabel", void 0);
__decorate([bindable, __metadata('design:type', Boolean)], Field.prototype, "integratedMode", void 0);
__decorate([observable(), __metadata('design:type', Object)], Field.prototype, "isValid", void 0);
Field = __decorate([inject(NewInstance.of(ValidationController), Element, Config, BindingEngine), __metadata('design:paramtypes', [ValidationController, Element, Config, BindingEngine])], Field);