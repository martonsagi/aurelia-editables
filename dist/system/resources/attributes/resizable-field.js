"use strict";

System.register(["aurelia-framework", "interact.js"], function (_export, _context) {
    "use strict";

    var autoinject, bindable, bindingMode, interact, _typeof, __decorate, __metadata, ResizableFieldCustomAttribute;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_aureliaFramework) {
            autoinject = _aureliaFramework.autoinject;
            bindable = _aureliaFramework.bindable;
            bindingMode = _aureliaFramework.bindingMode;
        }, function (_interactJs) {
            interact = _interactJs;
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

            _export("ResizableFieldCustomAttribute", ResizableFieldCustomAttribute = function () {
                function ResizableFieldCustomAttribute(element) {
                    _classCallCheck(this, ResizableFieldCustomAttribute);

                    this.options = {
                        inertia: true,
                        preserveAspectRatio: false,
                        edges: { left: false, right: true, bottom: false, top: false }
                    };
                    this.element = element;
                }

                ResizableFieldCustomAttribute.prototype.attached = function attached() {
                    var _this = this;

                    interact(this.element).resizable(Object.assign({}, this.options || {})).on('resizemove', function (event) {
                        return _this.dispatch('resizable-field-onmove', event);
                    });
                };

                ResizableFieldCustomAttribute.prototype.dispatch = function dispatch(name, data) {
                    this.element.dispatchEvent(new CustomEvent(name, {
                        bubbles: true,
                        detail: data
                    }));
                };

                return ResizableFieldCustomAttribute;
            }());

            _export("ResizableFieldCustomAttribute", ResizableFieldCustomAttribute);

            __decorate([bindable({ defaultBindingMode: bindingMode.oneWay }), __metadata('design:type', Object)], ResizableFieldCustomAttribute.prototype, "options", void 0);
            _export("ResizableFieldCustomAttribute", ResizableFieldCustomAttribute = __decorate([autoinject, __metadata('design:paramtypes', [Element])], ResizableFieldCustomAttribute));
        }
    };
});