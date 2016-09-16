"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RecordManager = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _record = require("./record");

var _aureliaFramework = require("aurelia-framework");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var RecordManager = exports.RecordManager = function () {
    function RecordManager(template) {
        _classCallCheck(this, RecordManager);

        this.queryModel = { filters: [] };
        this.validationStatus = {};
        this.isValid = true;
        this._template = template;
        this.records = new Array();
    }

    RecordManager.prototype.current = function current(item) {
        this.currentRecord = item;
    };

    RecordManager.prototype.load = function load(data) {
        this.setOriginal(data);
        for (var _iterator = data, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
            var _ref;

            if (_isArray) {
                if (_i >= _iterator.length) break;
                _ref = _iterator[_i++];
            } else {
                _i = _iterator.next();
                if (_i.done) break;
                _ref = _i.value;
            }

            var row = _ref;

            var record = new _record.Record(row);
            this.records.push(record);
        }
    };

    RecordManager.prototype.add = function add() {
        var templateData = JSON.parse(JSON.stringify(this._template));
        var newRow = new _record.Record(templateData, _record.RecordState.added);
        newRow.isValid = false;
        this.isValid = false;
        this.records.unshift(newRow);
        this.current(this.records[0]);
        for (var _iterator2 = this.queryModel.filters, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
            var _ref2;

            if (_isArray2) {
                if (_i2 >= _iterator2.length) break;
                _ref2 = _iterator2[_i2++];
            } else {
                _i2 = _iterator2.next();
                if (_i2.done) break;
                _ref2 = _i2.value;
            }

            var filter = _ref2;

            this.currentRecord[filter.field] = filter.value;
        }
        this.validate();
    };

    RecordManager.prototype.remove = function remove(item) {
        var i = this.records.indexOf(item);
        if (item.state !== _record.RecordState.added) {
            this[i].state = _record.RecordState.deleted;
        } else {
            this.records.splice(i, 1);
        }
        this.validate();
    };

    RecordManager.prototype.save = function save(changesOverride) {
        var changes = changesOverride || this.getChanges();
        if (changes.deleted.length > 0) {
            for (var _iterator3 = changes.deleted, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
                var _ref3;

                if (_isArray3) {
                    if (_i3 >= _iterator3.length) break;
                    _ref3 = _iterator3[_i3++];
                } else {
                    _i3 = _iterator3.next();
                    if (_i3.done) break;
                    _ref3 = _i3.value;
                }

                var row = _ref3;

                var i = this.records.indexOf(row);
                this.records.splice(i, 1);
            }
        }
        for (var _iterator4 = this.records, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
            var _ref4;

            if (_isArray4) {
                if (_i4 >= _iterator4.length) break;
                _ref4 = _iterator4[_i4++];
            } else {
                _i4 = _iterator4.next();
                if (_i4.done) break;
                _ref4 = _i4.value;
            }

            var _row = _ref4;

            _row.state = _record.RecordState.unchanged;
        }
        var originalRows = [];
        for (var _iterator5 = this.records, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
            var _ref5;

            if (_isArray5) {
                if (_i5 >= _iterator5.length) break;
                _ref5 = _iterator5[_i5++];
            } else {
                _i5 = _iterator5.next();
                if (_i5.done) break;
                _ref5 = _i5.value;
            }

            var _row2 = _ref5;

            var originalRow = {},
                props = Object.getOwnPropertyNames(this._template);
            for (var _iterator6 = props, _isArray6 = Array.isArray(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
                var _ref6;

                if (_isArray6) {
                    if (_i6 >= _iterator6.length) break;
                    _ref6 = _iterator6[_i6++];
                } else {
                    _i6 = _iterator6.next();
                    if (_i6.done) break;
                    _ref6 = _i6.value;
                }

                var field = _ref6;

                if (field in _row2) {
                    originalRow[field] = _row2[field];
                }
            }
            originalRows.push(originalRow);
        }
        this.originalRecords = this.setOriginal(originalRows);
    };

    RecordManager.prototype.dirty = function dirty() {
        var changes = this.getChanges();
        return changes.dirty === true;
    };

    RecordManager.prototype.cancel = function cancel() {
        var changes = this.getChanges();
        if (changes.dirty === false) {
            return false;
        }
        if (changes.added.length > 0) {
            for (var _iterator7 = changes.added, _isArray7 = Array.isArray(_iterator7), _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator]();;) {
                var _ref7;

                if (_isArray7) {
                    if (_i7 >= _iterator7.length) break;
                    _ref7 = _iterator7[_i7++];
                } else {
                    _i7 = _iterator7.next();
                    if (_i7.done) break;
                    _ref7 = _i7.value;
                }

                var row = _ref7;

                var index = this.records.indexOf(row);
                this.records.splice(index, 1);
            }
        }
        if (changes.deleted.length > 0 || changes.modified.length > 0) {
            var rows = changes.modified.concat(changes.deleted);
            var originalRows = JSON.parse(JSON.stringify(this.originalRecords));
            for (var _iterator8 = rows, _isArray8 = Array.isArray(_iterator8), _i8 = 0, _iterator8 = _isArray8 ? _iterator8 : _iterator8[Symbol.iterator]();;) {
                var _ref8;

                if (_isArray8) {
                    if (_i8 >= _iterator8.length) break;
                    _ref8 = _iterator8[_i8++];
                } else {
                    _i8 = _iterator8.next();
                    if (_i8.done) break;
                    _ref8 = _i8.value;
                }

                var _row3 = _ref8;

                var _index = this.records.indexOf(_row3);
                var originalRecord = new _record.Record(originalRows[_index]);
                this.records.splice(_index, 1, originalRecord);
            }
        }
        if (this.records.length > 0) {
            this.currentRecord = this.records[0];
            this.currentRecord = this.records[0];
        }
    };

    RecordManager.prototype.setOriginal = function setOriginal(data) {
        this.originalRecords = JSON.parse(JSON.stringify(data));
    };

    RecordManager.prototype.getOriginal = function getOriginal() {
        return JSON.parse(JSON.stringify(this.originalRecords));
    };

    RecordManager.prototype.getChanges = function getChanges() {
        var modified = this.records.filter(function (item) {
            return item.state === _record.RecordState.modified;
        });
        var added = this.records.filter(function (item) {
            return item.state === _record.RecordState.added;
        });
        var deleted = this.records.filter(function (item) {
            return item.state === _record.RecordState.deleted;
        });
        return {
            added: added,
            modified: modified,
            deleted: deleted,
            dirty: added.length > 0 || modified.length > 0 || deleted.length > 0
        };
    };

    RecordManager.prototype.validate = function validate() {
        this.isValid = true;
        var rows = this.records.filter(function (item) {
            return item.state !== _record.RecordState.deleted;
        });
        for (var _iterator9 = rows, _isArray9 = Array.isArray(_iterator9), _i9 = 0, _iterator9 = _isArray9 ? _iterator9 : _iterator9[Symbol.iterator]();;) {
            var _ref9;

            if (_isArray9) {
                if (_i9 >= _iterator9.length) break;
                _ref9 = _iterator9[_i9++];
            } else {
                _i9 = _iterator9.next();
                if (_i9.done) break;
                _ref9 = _i9.value;
            }

            var row = _ref9;

            if (row.isValid !== true) {
                this.isValid = false;
            }
        }
    };

    RecordManager.prototype.validateCurrentRecord = function validateCurrentRecord() {
        var isValid = true;
        for (var field in this.validationStatus) {
            if (this.validationStatus[field] === false) {
                isValid = false;
            }
        }
        this.currentRecord.isValid = isValid;
    };

    RecordManager.prototype.setValidationStatus = function setValidationStatus(field, isValid) {
        this.validationStatus[field] = isValid;
        this.validateCurrentRecord();
        this.validate();
    };

    return RecordManager;
}();

__decorate([(0, _aureliaFramework.observable)(), __metadata('design:type', Array)], RecordManager.prototype, "records", void 0);