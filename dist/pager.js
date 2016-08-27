var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", 'aurelia-framework'], function (require, exports, aurelia_framework_1) {
    "use strict";
    var Pager = (function () {
        function Pager() {
            this.current = 1;
            this.size = 10;
        }
        Pager.prototype.bind = function (bindingContext) {
            this.parent = bindingContext;
        };
        Pager.prototype.attached = function () {
        };
        Pager.prototype.setPage = function (num) {
            if (num === this.current)
                return false;
            if (this.parent.changePage(num, this.size) === true)
                this.current = num;
            return false;
        };
        Pager.prototype.prev = function () {
            if (this.current <= 1) {
                return false;
            }
            this.setPage(this.current - 1);
            return false;
        };
        Pager.prototype.next = function () {
            if (this.current >= this.total) {
                return false;
            }
            this.setPage(this.current + 1);
            return false;
        };
        Pager.prototype.update = function () {
            this.total = Math.ceil(this.count / this.size);
        };
        Pager.prototype.sizeChanged = function () {
            this.update();
        };
        Pager.prototype.countChanged = function () {
            this.update();
        };
        Pager.prototype.currentChanged = function () {
            this.update();
        };
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Number)
        ], Pager.prototype, "count", void 0);
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Number)
        ], Pager.prototype, "total", void 0);
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Number)
        ], Pager.prototype, "current", void 0);
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Number)
        ], Pager.prototype, "size", void 0);
        return Pager;
    }());
    exports.Pager = Pager;
});

//# sourceMappingURL=pager.js.map
