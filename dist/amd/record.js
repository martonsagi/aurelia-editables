define(['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.RecordState = exports.Record = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Record = exports.Record = function () {
        function Record(data, state) {
            _classCallCheck(this, Record);

            this.isValid = true;
            this.editMode = false;
            this.init = false;
            data.state = state || RecordState.unchanged;
            var props = Object.getOwnPropertyNames(data);
            for (var _iterator = props, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                var _ref;

                if (_isArray) {
                    if (_i >= _iterator.length) break;
                    _ref = _iterator[_i++];
                } else {
                    _i = _iterator.next();
                    if (_i.done) break;
                    _ref = _i.value;
                }

                var prop = _ref;

                this[prop] = data[prop];
            }
            var locator = _aureliaFramework.Container.instance.get(_aureliaFramework.BindingEngine);
            for (var _iterator2 = props, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
                var _ref2;

                if (_isArray2) {
                    if (_i2 >= _iterator2.length) break;
                    _ref2 = _iterator2[_i2++];
                } else {
                    _i2 = _iterator2.next();
                    if (_i2.done) break;
                    _ref2 = _i2.value;
                }

                var _prop = _ref2;

                switch (_prop) {
                    default:
                        locator.propertyObserver(this, _prop).subscribe(this.onChange.bind(this));
                        break;
                    case 'state':
                    case 'editMode':
                        locator.propertyObserver(this, _prop).subscribe(this.onStateChange.bind(this));
                        break;
                }
            }
            this.init = true;
        }

        Record.prototype.onChange = function onChange() {
            if (this.init === true && this.state === RecordState.unchanged) {
                this.state = RecordState.modified;
            }
        };

        Record.prototype.onStateChange = function onStateChange() {};

        return Record;
    }();

    var RecordState = exports.RecordState = {
        added: 'added',
        unchanged: 'unchanged',
        modified: 'modified',
        deleted: 'deleted'
    };
});