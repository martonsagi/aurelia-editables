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
import { bindable, inject, InlineViewStrategy, bindingMode, NewInstance, Container, BindingEngine } from 'aurelia-framework';
import { ValidationRules, ValidationController, validateTrigger } from 'aurelia-validation';
import { Record } from '../../record';
import { Config } from '../../config';
export var Field = function () {
    function Field(controller) {
        _classCallCheck(this, Field);

        this.editableClass = '';
        this.editMode = false;
        this.withLabel = true;
        this.integratedMode = false;
        this.validationMode = validateTrigger.change;
        this.isValid = true;
        this.init = 0;
        this.controller = controller;
        this.controller.validateTrigger = validateTrigger.manual;
        this.element = Container.instance.get(Element);
        this.fieldModel = this;
        this.pluginConfig = Container.instance.get(Config);
        var locator = Container.instance.get(BindingEngine);
        locator.propertyObserver(this, 'isValid').subscribe(this.isValidChanged.bind(this));
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

    Field.prototype.setValidation = function setValidation() {
        if (this.options.validation) {
            if (this.options.validationMode) this.validationMode = this.options.validationMode;
            var validationRules = ValidationRules.ensure('fieldValue'),
                props = Object.getOwnPropertyNames(this.options.validation);
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

                var ruleConfig = this.options.validation[key],
                    ruleName = key,
                    rule = void 0;
                switch (key) {
                    case 'required':
                        ruleName = 'presence';
                        break;
                }
            }
        }
    };

    Field.prototype.validate = function validate() {
        var _this = this;

        if (this.integratedMode !== true) {
            this.init++;
            if (this.init <= 1) return;
        }
        this.dispatch('on-before-validate', { viewModel: this });
        this.controller.validate().then(function (errors) {
            _this.errors = errors;
            _this.isValid = _this.errors.length === 0;
            _this.dispatch('on-after-validate', { viewModel: _this });
        });
    };

    Field.prototype.isValidChanged = function isValidChanged(newValue) {
        if (this.dataObject) {
            this.dataObject.au.controller.viewModel.setValidationStatus(this.options.name, newValue);
        }
    };

    Field.prototype.fieldValueChanged = function fieldValueChanged() {
        if (this.validationMode === validateTrigger.change) this.validate();
        this.setDisplayValue();
        this.dispatch('on-fieldvalue-changed', { viewModel: this });
    };

    Field.prototype.blur = function blur() {
        if (this.validationMode === validateTrigger.blur || this.integratedMode === true) this.validate();
        this.dispatch('on-blur', { viewModel: this });
    };

    Field.prototype.setEditMode = function setEditMode() {
        this.editMode = !this.editMode;
    };

    Field.prototype.setDisplayValue = function setDisplayValue() {
        var _this2 = this;

        this.displayValue = this.fieldValue;
        switch (this.editorType) {
            case 'dropdown':
                var check = this.options.editor.values ? this.options.editor.values.find(function (f) {
                    return f.value == _this2.fieldValue;
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
Field = __decorate([inject(NewInstance.of(ValidationController), Element), __metadata('design:paramtypes', [ValidationController])], Field);