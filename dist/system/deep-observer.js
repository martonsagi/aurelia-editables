"use strict";

System.register(["aurelia-framework", "aurelia-dependency-injection"], function (_export, _context) {
    "use strict";

    var BindingEngine, autoinject, _typeof, __decorate, __metadata, DeepObserver;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_aureliaFramework) {
            BindingEngine = _aureliaFramework.BindingEngine;
        }, function (_aureliaDependencyInjection) {
            autoinject = _aureliaDependencyInjection.autoinject;
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

            _export("DeepObserver", DeepObserver = function () {
                function DeepObserver(bindingEngine) {
                    _classCallCheck(this, DeepObserver);

                    this._bindingEngine = bindingEngine;
                }

                DeepObserver.prototype.observe = function observe(target, property, callback) {
                    var _this = this;

                    var subscriptions = { root: null, children: [] };
                    subscriptions.root = this._bindingEngine.propertyObserver(target, property).subscribe(function (n, o) {
                        _this.disconnect(subscriptions.children);
                        var path = property;
                        _this.recurse(target, property, subscriptions.children, callback, path);
                    });
                    return function () {
                        _this.disconnect(subscriptions.children);
                        subscriptions.root.dispose();
                    };
                };

                DeepObserver.prototype.disconnect = function disconnect(subscriptions) {
                    while (subscriptions.length) {
                        subscriptions.pop().dispose();
                    }
                };

                DeepObserver.prototype.recurse = function recurse(target, property, subscriptions, callback, path) {
                    var sub = target[property];
                    if ((typeof sub === "undefined" ? "undefined" : _typeof(sub)) === "object") {
                        for (var p in sub) {
                            if (sub.hasOwnProperty(p)) {
                                this.recurse(sub, p, subscriptions, callback, "" + path + (sub instanceof Array ? '[' + p + ']' : '.' + p));
                            }
                        }
                    }
                    if (target != property) {
                        subscriptions.push(this._bindingEngine.propertyObserver(target, property).subscribe(function (n, o) {
                            return callback(n, o, path);
                        }));
                    }
                };

                return DeepObserver;
            }());

            _export("DeepObserver", DeepObserver);

            _export("DeepObserver", DeepObserver = __decorate([autoinject(), __metadata('design:paramtypes', [BindingEngine])], DeepObserver));
        }
    };
});