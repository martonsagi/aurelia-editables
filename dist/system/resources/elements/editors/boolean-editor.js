"use strict";

System.register(["aurelia-framework", "../field"], function (_export, _context) {
    "use strict";

    var bindable, bindingMode, Field, _typeof, __decorate, __metadata, BooleanEditor;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_aureliaFramework) {
            bindable = _aureliaFramework.bindable;
            bindingMode = _aureliaFramework.bindingMode;
        }, function (_field) {
            Field = _field.Field;
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

            _export("BooleanEditor", BooleanEditor = function () {
                function BooleanEditor() {
                    _classCallCheck(this, BooleanEditor);
                }

                BooleanEditor.prototype.activate = function activate(model) {
                    this.field = model;
                };

                return BooleanEditor;
            }());

            _export("BooleanEditor", BooleanEditor);

            __decorate([bindable({ defaultBindingMode: bindingMode.twoWay }), __metadata('design:type', Field)], BooleanEditor.prototype, "field", void 0);
        }
    };
});