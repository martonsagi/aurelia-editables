"use strict";

System.register(["aurelia-framework"], function (_export, _context) {
    "use strict";

    var bindable, _typeof, __decorate, __metadata, Pager;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_aureliaFramework) {
            bindable = _aureliaFramework.bindable;
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

            _export("Pager", Pager = function () {
                function Pager() {
                    _classCallCheck(this, Pager);

                    this.current = 1;
                    this.size = 10;
                }

                Pager.prototype.bind = function bind(bindingContext) {
                    this.parent = bindingContext;
                };

                Pager.prototype.attached = function attached() {};

                Pager.prototype.setPage = function setPage(num) {
                    if (num === this.current) return false;
                    if (this.parent.changePage(num, this.size) === true) this.current = num;
                    return false;
                };

                Pager.prototype.prev = function prev() {
                    if (this.current <= 1) {
                        return false;
                    }
                    this.setPage(this.current - 1);
                    return false;
                };

                Pager.prototype.next = function next() {
                    if (this.current >= this.total) {
                        return false;
                    }
                    this.setPage(this.current + 1);
                    return false;
                };

                Pager.prototype.update = function update() {
                    this.total = Math.ceil(this.count / this.size);
                };

                Pager.prototype.sizeChanged = function sizeChanged() {
                    this.update();
                };

                Pager.prototype.countChanged = function countChanged() {
                    this.update();
                };

                Pager.prototype.currentChanged = function currentChanged() {
                    this.update();
                };

                return Pager;
            }());

            _export("Pager", Pager);

            __decorate([bindable, __metadata('design:type', Number)], Pager.prototype, "count", void 0);
            __decorate([bindable, __metadata('design:type', Number)], Pager.prototype, "total", void 0);
            __decorate([bindable, __metadata('design:type', Number)], Pager.prototype, "current", void 0);
            __decorate([bindable, __metadata('design:type', Number)], Pager.prototype, "size", void 0);
        }
    };
});