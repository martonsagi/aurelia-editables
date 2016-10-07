"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Field = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _aureliaFramework = require("aurelia-framework");

var _aureliaValidation = require("aurelia-validation");

var _record = require("../../record");

var _config = require("../../config");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = undefined && undefined.__metadata || function (k, v) {
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Field = exports.Field = function () {
    function Field(controller, element, config, bindingEngine) {
        _classCallCheck(this, Field);

        this.editableClass = '';
        this.editMode = false;
        this.withLabel = true;
        this.integratedMode = false;
        this.validationMode = _aureliaValidation.validateTrigger.change;
        this.isValid = false;
        this.init = 0;
        this.controller = controller;
        this.controller.validateTrigger = _aureliaValidation.validateTrigger.manual;
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
        this.viewStrategy = new _aureliaFramework.InlineViewStrategy("<template>" + template + "</template>");
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
            var props = Object.getOwnPropertyNames(this.options.validation).filter(function (prop) {
                return prop !== '__observers__';
            });
            if (props.length > 0) {
                var validator = _aureliaValidation.ValidationRules;
                for (var _iterator = props, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                    var _validator$ensure$dis;

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

                    var ruleConfig = this.options.validation[key],
                        ruleName = key;
                    validator = (_validator$ensure$dis = validator.ensure('fieldValue').displayName(this.options.title || this.options.name)).satisfiesRule.apply(_validator$ensure$dis, [ruleName].concat(ruleConfig)).on(this);
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
            _this2.isValid = _this2.errors.length === 0;
            if (_this2.record && _this2.record.setValidationStatus) {
                _this2.record.setValidationStatus(_this2.options.name, _this2.isValid === true ? _record.RecordValidationState.valid : _record.RecordValidationState.invalid);
                _this2.record.validate();
            }
            _this2.dispatch('on-after-validate', { viewModel: _this2 });
        });
    };

    Field.prototype.fieldValueChanged = function fieldValueChanged() {
        if (this.editMode === true) {
            this.validate();
        }
        this.setDisplayValue();
        this.dispatch('on-fieldvalue-changed', { viewModel: this });
    };

    Field.prototype.blur = function blur() {
        this.validate();
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
__decorate([(0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), __metadata('design:type', Object)], Field.prototype, "fieldValue", void 0);
__decorate([(0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), __metadata('design:type', Field)], Field.prototype, "fieldModel", void 0);
__decorate([(0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), __metadata('design:type', _record.Record)], Field.prototype, "record", void 0);
__decorate([_aureliaFramework.bindable, __metadata('design:type', Object)], Field.prototype, "options", void 0);
__decorate([_aureliaFramework.bindable, __metadata('design:type', Object)], Field.prototype, "dataObject", void 0);
__decorate([_aureliaFramework.bindable, __metadata('design:type', String)], Field.prototype, "editableClass", void 0);
__decorate([_aureliaFramework.bindable, __metadata('design:type', Boolean)], Field.prototype, "editMode", void 0);
__decorate([_aureliaFramework.bindable, __metadata('design:type', Boolean)], Field.prototype, "withLabel", void 0);
__decorate([_aureliaFramework.bindable, __metadata('design:type', Boolean)], Field.prototype, "integratedMode", void 0);
exports.Field = Field = __decorate([(0, _aureliaFramework.inject)(_aureliaFramework.NewInstance.of(_aureliaValidation.ValidationController), Element, _config.Config, _aureliaFramework.BindingEngine), __metadata('design:paramtypes', [_aureliaValidation.ValidationController, Element, _config.Config, _aureliaFramework.BindingEngine])], Field);