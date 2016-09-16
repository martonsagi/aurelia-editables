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
import { autoinject, bindable, bindingMode } from 'aurelia-framework';
import * as interact from 'interact.js';
export let ResizableFieldCustomAttribute = class ResizableFieldCustomAttribute {
    constructor(element) {
        this.options = {
            inertia: true,
            preserveAspectRatio: false,
            edges: { left: false, right: true, bottom: false, top: false }
        };
        this.element = element;
    }
    attached() {
        interact(this.element).resizable(Object.assign({}, this.options || {})).on('resizemove', event => this.dispatch('resizable-field-onmove', event));
    }
    dispatch(name, data) {
        this.element.dispatchEvent(new CustomEvent(name, {
            bubbles: true,
            detail: data
        }));
    }
};
__decorate([bindable({ defaultBindingMode: bindingMode.oneWay }), __metadata('design:type', Object)], ResizableFieldCustomAttribute.prototype, "options", void 0);
ResizableFieldCustomAttribute = __decorate([autoinject, __metadata('design:paramtypes', [Element])], ResizableFieldCustomAttribute);