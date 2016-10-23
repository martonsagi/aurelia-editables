"use strict";

System.register(["aurelia-framework", "../field", "../../../config"], function (_export, _context) {
    "use strict";

    var bindable, bindingMode, Container, Field, Config, _typeof, __decorate, __metadata, DropdownEditor;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_aureliaFramework) {
            bindable = _aureliaFramework.bindable;
            bindingMode = _aureliaFramework.bindingMode;
            Container = _aureliaFramework.Container;
        }, function (_field) {
            Field = _field.Field;
        }, function (_config) {
            Config = _config.Config;
        }],
        execute: function () {
            _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
                return typeof obj;
            } : function (obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };

            __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
                var c = arguments.length,
                    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
                    d;
                if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
                    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
                }return c > 3 && r && Object.defineProperty(target, key, r), r;
            };

            __metadata = undefined && undefined.__metadata || function (k, v) {
                if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
            };

            _export("DropdownEditor", DropdownEditor = function () {
                function DropdownEditor() {
                    _classCallCheck(this, DropdownEditor);

                    this.loaded = false;
                    this.pluginConfig = Container.instance.get(Config);
                    this.apiClass = this.pluginConfig.api;
                }

                DropdownEditor.prototype.activate = function activate(model) {
                    this.field = model;
                };

                DropdownEditor.prototype.attached = function attached() {
                    var _this = this;

                    this.loaded = false;
                    var editorSettings = this.field.options.editor,
                        displayProperty = editorSettings.displayProperty || 'text',
                        valueProperty = editorSettings.displayProperty || 'value';
                    var callApi = editorSettings.api !== null && editorSettings.api.length > 0 && !editorSettings.values;
                    if (!callApi) {
                        this.mapValues(editorSettings.values, displayProperty, valueProperty).then(function (result) {
                            _this.values = result;
                            _this.loaded = true;
                        });
                    } else {
                        this.api = new this.apiClass(editorSettings.api);
                        this.api.read(editorSettings.query ? editorSettings.query : {}).then(function (result) {
                            return _this.mapValues(result, displayProperty, valueProperty);
                        }).then(function (result) {
                            _this.values = result;
                            editorSettings.values = result;
                            _this.loaded = true;
                        });
                    }
                };

                DropdownEditor.prototype.mapValues = function mapValues(values, displayProperty, valueProperty) {
                    var _this2 = this;

                    return new Promise(function (resolve, reject) {
                        var editorSettings = _this2.field.options.editor;
                        if (editorSettings.mapValues === true) {
                            var result = [];
                            for (var _iterator = values, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                                var _ref;

                                if (_isArray) {
                                    if (_i >= _iterator.length) break;
                                    _ref = _iterator[_i++];
                                } else {
                                    _i = _iterator.next();
                                    if (_i.done) break;
                                    _ref = _i.value;
                                }

                                var item = _ref;

                                result.push({
                                    'text': item[displayProperty],
                                    'value': item[valueProperty]
                                });
                            }
                            resolve(result);
                        } else {
                            resolve(values);
                        }
                    });
                };

                return DropdownEditor;
            }());

            _export("DropdownEditor", DropdownEditor);

            __decorate([bindable({ defaultBindingMode: bindingMode.twoWay }), __metadata('design:type', Field)], DropdownEditor.prototype, "field", void 0);
        }
    };
});