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
                return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
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

                    this.pluginConfig = Container.instance.get(Config);
                    this.apiClass = this.pluginConfig.api;
                }

                DropdownEditor.prototype.activate = function activate(model) {
                    this.field = model;
                };

                DropdownEditor.prototype.attached = function attached() {
                    var t = this;
                    var editorSettings = this.field.options.editor;
                    var callApi = editorSettings.api !== null && editorSettings.api.length > 0 && !editorSettings.values;
                    if (!callApi) {
                        this.values = editorSettings.values;
                    } else {
                        this.api = new this.apiClass(editorSettings.api);
                        this.api.get().then(function (result) {
                            t.values = result;
                            editorSettings.values = result;
                        });
                    }
                };

                return DropdownEditor;
            }());

            _export("DropdownEditor", DropdownEditor);

            __decorate([bindable({ defaultBindingMode: bindingMode.twoWay }), __metadata('design:type', Field)], DropdownEditor.prototype, "field", void 0);
        }
    };
});