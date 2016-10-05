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
import { BindingEngine } from "aurelia-framework";
import { autoinject } from "aurelia-dependency-injection";
export let DeepObserver = class DeepObserver {
    constructor(bindingEngine) {
        this._bindingEngine = bindingEngine;
    }
    observe(target, property, callback) {
        var subscriptions = { root: null, children: [] };
        subscriptions.root = this._bindingEngine.propertyObserver(target, property).subscribe((n, o) => {
            this.disconnect(subscriptions.children);
            let path = property;
            this.recurse(target, property, subscriptions.children, callback, path);
        });
        return () => {
            this.disconnect(subscriptions.children);
            subscriptions.root.dispose();
        };
    }
    disconnect(subscriptions) {
        while (subscriptions.length) {
            subscriptions.pop().dispose();
        }
    }
    recurse(target, property, subscriptions, callback, path) {
        let sub = target[property];
        if (typeof sub === "object") {
            for (var p in sub) if (sub.hasOwnProperty(p)) {
                this.recurse(sub, p, subscriptions, callback, `${ path }${ sub instanceof Array ? '[' + p + ']' : '.' + p }`);
            }
        }
        if (target != property) {
            subscriptions.push(this._bindingEngine.propertyObserver(target, property).subscribe((n, o) => callback(n, o, path)));
        }
    }
};
DeepObserver = __decorate([autoinject(), __metadata('design:paramtypes', [BindingEngine])], DeepObserver);