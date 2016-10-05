define(["exports", "aurelia-framework", "../../record"], function (exports, _aureliaFramework, _record) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.DataForm = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
    };

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
    var DataForm = exports.DataForm = function () {
        function DataForm(element) {
            _classCallCheck(this, DataForm);

            this.integratedMode = false;
            this.showToolbar = false;
            this.isValid = true;
            this.validationStatus = {};
            this.element = element;
            this.dispatch('on-created', { viewModel: this });
        }

        DataForm.prototype.bind = function bind(context) {
            this.parent = context;
            this.dispatch('on-bind', { viewModel: this, context: context });
        };

        DataForm.prototype.attached = function attached() {
            var _this = this;

            var currentGroups = this.options.form && this.options.form.groups && this.options.form.groups.length > 0 ? this.options.form.groups : null;
            this.groups = [];
            if (currentGroups === null) {
                this.groups.push({ id: 0, name: null, fields: this.options.columns });
                this.options.form.groupCols = 'col-xs-12';
            } else {
                var _loop = function _loop() {
                    if (_isArray) {
                        if (_i >= _iterator.length) return "break";
                        _ref = _iterator[_i++];
                    } else {
                        _i = _iterator.next();
                        if (_i.done) return "break";
                        _ref = _i.value;
                    }

                    var group = _ref;

                    var groupFields = _this.options.columns.filter(function (column) {
                        return column.groupId === group.id;
                    });
                    _this.groups.push({ id: group.id, name: group.name, fields: groupFields });
                };

                for (var _iterator = currentGroups, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                    var _ref;

                    var _ret = _loop();

                    if (_ret === "break") break;
                }
            }
            this.dispatch('on-attached', this);
        };

        DataForm.prototype.recordChanged = function recordChanged(newVal, oldVal) {
            this.dispatch('on-record-changed', { newValue: newVal, oldValue: oldVal, viewModel: this });
        };

        DataForm.prototype.callSave = function callSave(event) {
            this.validate();
            if (this.isValid === true) {
                if (this.parent && this.onSave) {
                    this.onSave.call(this.parent, event);
                }
            }
        };

        DataForm.prototype.callCancel = function callCancel(event) {
            if (this.parent && this.onCancel) {
                this.onCancel.call(this.parent, event);
            }
            this.validate();
        };

        DataForm.prototype.setValidationStatus = function setValidationStatus(field, isValid) {
            this.validationStatus[field] = isValid;
            this.validate();
        };

        DataForm.prototype.validate = function validate() {
            this.dispatch('on-before-validate', { viewModel: this });
            this.isValid = true;
            var props = Object.getOwnPropertyNames(this.validationStatus);
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

                var field = _ref2;

                if (this.validationStatus[field] === false) {
                    this.isValid = false;
                }
            }
            this.record.isValid = this.isValid;
            this.dispatch('on-after-validate', this);
        };

        DataForm.prototype.dispatch = function dispatch(name, data) {
            this.element.dispatchEvent(new CustomEvent(name, {
                bubbles: true,
                detail: data
            }));
        };

        return DataForm;
    }();
    __decorate([(0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), __metadata('design:type', _record.Record)], DataForm.prototype, "record", void 0);
    __decorate([_aureliaFramework.bindable, __metadata('design:type', Object)], DataForm.prototype, "options", void 0);
    __decorate([_aureliaFramework.bindable, __metadata('design:type', Function)], DataForm.prototype, "onSave", void 0);
    __decorate([_aureliaFramework.bindable, __metadata('design:type', Function)], DataForm.prototype, "onCancel", void 0);
    __decorate([_aureliaFramework.bindable, __metadata('design:type', Object)], DataForm.prototype, "integratedMode", void 0);
    __decorate([_aureliaFramework.bindable, __metadata('design:type', Object)], DataForm.prototype, "showToolbar", void 0);
    exports.DataForm = DataForm = __decorate([_aureliaFramework.autoinject, __metadata('design:paramtypes', [Element])], DataForm);
});