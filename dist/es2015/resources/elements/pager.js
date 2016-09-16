var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = this && this.__metadata || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { bindable } from 'aurelia-framework';
export let Pager = class Pager {
    constructor() {
        this.current = 1;
        this.size = 10;
    }
    bind(bindingContext) {
        this.parent = bindingContext;
    }
    attached() {}
    setPage(num) {
        if (num === this.current) return false;
        if (this.parent.changePage(num, this.size) === true) this.current = num;
        return false;
    }
    prev() {
        if (this.current <= 1) {
            return false;
        }
        this.setPage(this.current - 1);
        return false;
    }
    next() {
        if (this.current >= this.total) {
            return false;
        }
        this.setPage(this.current + 1);
        return false;
    }
    update() {
        this.total = Math.ceil(this.count / this.size);
    }
    sizeChanged() {
        this.update();
    }
    countChanged() {
        this.update();
    }
    currentChanged() {
        this.update();
    }
};
__decorate([bindable, __metadata('design:type', Number)], Pager.prototype, "count", void 0);
__decorate([bindable, __metadata('design:type', Number)], Pager.prototype, "total", void 0);
__decorate([bindable, __metadata('design:type', Number)], Pager.prototype, "current", void 0);
__decorate([bindable, __metadata('design:type', Number)], Pager.prototype, "size", void 0);