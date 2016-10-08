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
import { Container, BindingEngine, observable } from 'aurelia-framework';
export var Record = function () {
    function Record(data, state) {
        _classCallCheck(this, Record);

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

    Record.prototype.setRecordManager = function setRecordManager(manager) {
        this.recordManager = manager;
    };

    Record.prototype.setValidationFields = function setValidationFields(fieldNames) {
        var _this = this;

        return new Promise(function (resolve, reject) {
            if (_this.isValidationActivated === true) return;
            _this.validationFields = fieldNames;
            for (var _iterator = fieldNames, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                var _ref;

                if (_isArray) {
                    if (_i >= _iterator.length) break;
                    _ref = _iterator[_i++];
                } else {
                    _i = _iterator.next();
                    if (_i.done) break;
                    _ref = _i.value;
                }

                var name = _ref;

                _this.validationStatus[name] = RecordValidationState.invalid;
                _this.subscriptions.push(_this.bindingEngine.propertyObserver(_this.validationStatus, name).subscribe(_this.onValidationFieldsChange.bind(_this)));
            }
            var props = Object.getOwnPropertyNames(_this._data);
            for (var _iterator2 = props, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
                var _ref2;

                if (_isArray2) {
                    if (_i2 >= _iterator2.length) break;
                    _ref2 = _iterator2[_i2++];
                } else {
                    _i2 = _iterator2.next();
                    if (_i2.done) break;
                    _ref2 = _i2.value;
                }

                var prop = _ref2;

                switch (prop) {
                    default:
                        _this.subscriptions.push(_this.bindingEngine.propertyObserver(_this, prop).subscribe(_this.onChange.bind(_this)));
                        break;
                    case "state":
                    case "editMode":
                        break;
                }
            }
            _this.isValidationActivated = true;
            resolve();
        });
    };

    Record.prototype.onValidationFieldsChange = function onValidationFieldsChange(newValue, oldValue) {
        this.validate();
    };

    Record.prototype.setValidationStatus = function setValidationStatus(field, state) {
        this.validationStatus[field] = state;
    };

    Record.prototype.validate = function validate() {
        var _this2 = this;

        return new Promise(function (resolve, reject) {
            if (_this2.validationFields.length === 0) {
                resolve();
            }
            _this2.isValid = true;
            for (var _iterator3 = _this2.validationFields, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
                var _ref3;

                if (_isArray3) {
                    if (_i3 >= _iterator3.length) break;
                    _ref3 = _iterator3[_i3++];
                } else {
                    _i3 = _iterator3.next();
                    if (_i3.done) break;
                    _ref3 = _i3.value;
                }

                var field = _ref3;

                if (_this2.validationStatus[field] !== RecordValidationState.valid) {
                    _this2.isValid = false;
                }
            }
            resolve();
        });
    };

    Record.prototype.onChange = function onChange() {
        if (this.init === true && this.state === RecordState.unchanged) {
            this.state = RecordState.modified;
        }
    };

    Record.prototype.isValidChanged = function isValidChanged() {
        if (this.recordManager) {
            this.recordManager.validate();
        }
    };

    Record.prototype.editModeChanged = function editModeChanged() {
        if (this.editMode === false) {
            this.dispose();
            this.isValidationActivated = false;
        }
    };

    Record.prototype.onStateChange = function onStateChange() {};

    Record.prototype.dispose = function dispose() {
        if (this.subscriptions && this.subscriptions.length > 0) {
            for (var _iterator4 = this.subscriptions, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
                var _ref4;

                if (_isArray4) {
                    if (_i4 >= _iterator4.length) break;
                    _ref4 = _iterator4[_i4++];
                } else {
                    _i4 = _iterator4.next();
                    if (_i4.done) break;
                    _ref4 = _i4.value;
                }

                var sub = _ref4;

                sub.dispose();
            }
        }
        this.subscriptions = [];
    };

    return Record;
}();
__decorate([observable(), __metadata('design:type', String)], Record.prototype, "state", void 0);
__decorate([observable(), __metadata('design:type', Boolean)], Record.prototype, "editMode", void 0);
__decorate([observable(), __metadata('design:type', Object)], Record.prototype, "validationStatus", void 0);
__decorate([observable(), __metadata('design:type', Boolean)], Record.prototype, "isValid", void 0);
export var RecordState = {
    added: 'added',
    unchanged: 'unchanged',
    modified: 'modified',
    deleted: 'deleted'
};
export var RecordValidationState = {
    valid: 'valid',
    invalid: 'invalid'
};