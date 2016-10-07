"use strict";

System.register(["./record", "aurelia-framework"], function (_export, _context) {
    "use strict";

    var Record, RecordState, observable, _typeof, __decorate, __metadata, RecordManager;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_record) {
            Record = _record.Record;
            RecordState = _record.RecordState;
        }, function (_aureliaFramework) {
            observable = _aureliaFramework.observable;
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

            _export("RecordManager", RecordManager = function () {
                function RecordManager(template) {
                    _classCallCheck(this, RecordManager);

                    this.isValid = false;
                    this.queryModel = { filters: [] };
                    this.validationFields = [];
                    this._template = template;
                    this.records = new Array();
                    this.currentRecord = {};
                }

                RecordManager.prototype.current = function current(item) {
                    this.currentRecord = item;
                    if (this.currentRecord.editMode === true) {
                        this.currentRecord.setValidationFields(this.validationFields);
                    }
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

                        var record = new Record(row);
                        record.setRecordManager(this);
                        this.records.push(record);
                    }
                };

                RecordManager.prototype.add = function add() {
                    var templateData = JSON.parse(JSON.stringify(this._template));
                    var newRow = new Record(templateData, RecordState.added);
                    newRow.setRecordManager(this);
                    if (this.validationFields && this.validationFields.length > 0) {
                        newRow.setValidationFields(this.validationFields);
                    }
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

                RecordManager.prototype.edit = function edit(toggle) {
                    if (toggle === true) {
                        if (this.currentRecord) {
                            this.currentRecord.setValidationFields(this.validationFields);
                            this.currentRecord.editMode = true;
                            this.currentRecord.validate();
                        }
                    } else {
                        if (this.currentRecord) {
                            this.currentRecord.editMode = false;
                        }
                    }
                };

                RecordManager.prototype.remove = function remove(item) {
                    var i = this.records.indexOf(item);
                    if (item.state !== RecordState.added) {
                        this.records[i].state = RecordState.deleted;
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

                        _row.state = RecordState.unchanged;
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
                            var originalRecord = new Record(originalRows[_index]);
                            this.records.splice(_index, 1, originalRecord);
                        }
                    }
                    if (this.records.length > 0) {
                        this.currentRecord = this.records[0];
                    } else {
                        this.currentRecord = {};
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
                        return item.state === RecordState.modified;
                    });
                    var added = this.records.filter(function (item) {
                        return item.state === RecordState.added;
                    });
                    var deleted = this.records.filter(function (item) {
                        return item.state === RecordState.deleted;
                    });
                    return {
                        added: added,
                        modified: modified,
                        deleted: deleted,
                        dirty: added.length > 0 || modified.length > 0 || deleted.length > 0
                    };
                };

                RecordManager.prototype.setValidationFields = function setValidationFields(fieldNames) {
                    this.validationFields = fieldNames;
                };

                RecordManager.prototype.validate = function validate() {
                    this.isValid = false;
                    if (this.dirty() === false) {
                        return;
                    }
                    var rows = this.records.filter(function (item) {
                        return (item.state === RecordState.added || item.state === RecordState.modified) && item.isValid === false;
                    });
                    this.isValid = rows.length === 0;
                };

                return RecordManager;
            }());

            _export("RecordManager", RecordManager);

            __decorate([observable, __metadata('design:type', Object)], RecordManager.prototype, "currentRecord", void 0);
            __decorate([observable(), __metadata('design:type', Boolean)], RecordManager.prototype, "isValid", void 0);
        }
    };
});