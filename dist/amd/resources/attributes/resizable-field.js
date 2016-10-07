define(["exports", "aurelia-framework"], function (exports, _aureliaFramework) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.ResizableFieldCustomAttribute = undefined;

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
    var ResizableFieldCustomAttribute = exports.ResizableFieldCustomAttribute = function () {
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

            window.interact(this.element).resizable(Object.assign({}, this.options || {})).on('resizemove', function (event) {
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
    }();
    __decorate([(0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.oneWay }), __metadata('design:type', Object)], ResizableFieldCustomAttribute.prototype, "options", void 0);
    exports.ResizableFieldCustomAttribute = ResizableFieldCustomAttribute = __decorate([_aureliaFramework.autoinject, __metadata('design:paramtypes', [Element])], ResizableFieldCustomAttribute);
});