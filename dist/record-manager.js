var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './record', 'lodash'], function (require, exports, record_1, _) {
    "use strict";
    var RecordManager = (function (_super) {
        __extends(RecordManager, _super);
        function RecordManager(template) {
            _super.call(this);
            this.validationStatus = {};
            this.isValid = true;
            this._template = template;
        }
        RecordManager.prototype.current = function (item) {
            this.currentRecord = item;
        };
        RecordManager.prototype.load = function (data) {
            this.setOriginal(data);
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var row = data_1[_i];
                var record = new record_1.Record(row);
                this.push(record);
            }
        };
        RecordManager.prototype.add = function () {
            var filters = this.filters.filter.filters, templateData = JSON.parse(JSON.stringify(this._template));
            var newRow = new record_1.Record(templateData, record_1.RecordState.added);
            newRow.isValid = false;
            this.isValid = false;
            this.unshift(newRow);
            this.current(this[0]);
            for (var _i = 0, filters_1 = filters; _i < filters_1.length; _i++) {
                var filter = filters_1[_i];
                this.currentRecord[filter.field] = filter.value;
            }
            this.validate();
        };
        RecordManager.prototype.remove = function (item) {
            var i = this.indexOf(item);
            if (item.state !== record_1.RecordState.added) {
                this[i].state = record_1.RecordState.deleted;
            }
            else {
                this.splice(i, 1);
            }
            this.validate();
        };
        RecordManager.prototype.save = function (changesOverride) {
            var changes = changesOverride || this.getChanges();
            if (changes.deleted.length > 0) {
                for (var _i = 0, _a = changes.deleted; _i < _a.length; _i++) {
                    var row = _a[_i];
                    var i = this.indexOf(row);
                    this.splice(i, 1);
                }
            }
            for (var _b = 0, _c = this; _b < _c.length; _b++) {
                var row = _c[_b];
                row.state = record_1.RecordState.unchanged;
            }
            var originalRows = [];
            for (var _d = 0, _e = this; _d < _e.length; _d++) {
                var row = _e[_d];
                var originalRow = {}, props = Object.getOwnPropertyNames(this._template);
                for (var _f = 0, props_1 = props; _f < props_1.length; _f++) {
                    var field = props_1[_f];
                    if (field in row) {
                        originalRow[field] = row[field];
                    }
                }
                originalRows.push(originalRow);
            }
            this.originalRecords = this.setOriginal(originalRows);
        };
        RecordManager.prototype.dirty = function () {
            var changes = this.getChanges();
            return changes.dirty === true;
        };
        RecordManager.prototype.cancel = function () {
            var changes = this.getChanges();
            if (changes.dirty === false) {
                return false;
            }
            if (changes.added.length > 0) {
                for (var _i = 0, _a = changes.added; _i < _a.length; _i++) {
                    var row = _a[_i];
                    var index = this.indexOf(row);
                    this.splice(index, 1);
                }
            }
            if (changes.deleted.length > 0 || changes.modified.length > 0) {
                var rows = changes.modified.concat(changes.deleted);
                var originalRows = JSON.parse(JSON.stringify(this.originalRecords));
                for (var _b = 0, rows_1 = rows; _b < rows_1.length; _b++) {
                    var row = rows_1[_b];
                    var index = this.indexOf(row);
                    var originalRecord = new record_1.Record(originalRows[index]);
                    this.splice(index, 1, originalRecord);
                }
            }
            if (this.length > 0) {
                this.currentRecord = this[0];
            }
        };
        RecordManager.prototype.setOriginal = function (data) {
            this.originalRecords = JSON.parse(JSON.stringify(data));
        };
        RecordManager.prototype.getOriginal = function () {
            return JSON.parse(JSON.stringify(this.originalRecords));
        };
        RecordManager.prototype.getChanges = function () {
            var modified = _.filter(this, function (item) {
                return item.state === record_1.RecordState.modified;
            });
            var added = _.filter(this, function (item) {
                return item.state === record_1.RecordState.added;
            });
            var deleted = _.filter(this, function (item) {
                return item.state === record_1.RecordState.deleted;
            });
            return {
                added: added,
                modified: modified,
                deleted: deleted,
                dirty: added.length > 0 || modified.length > 0 || deleted.length > 0
            };
        };
        RecordManager.prototype.validate = function () {
            this.isValid = true;
            var rows = _.filter(this, function (item) { return item.state !== record_1.RecordState.deleted; });
            for (var _i = 0, rows_2 = rows; _i < rows_2.length; _i++) {
                var row = rows_2[_i];
                if (row.isValid !== true) {
                    this.isValid = false;
                }
            }
        };
        RecordManager.prototype.validateCurrentRecord = function () {
            var isValid = true;
            for (var field in this.validationStatus) {
                if (this.validationStatus[field] === false) {
                    isValid = false;
                }
            }
            this.currentRecord.isValid = isValid;
        };
        RecordManager.prototype.setValidationStatus = function (field, isValid) {
            this.validationStatus[field] = isValid;
            this.validateCurrentRecord();
            this.validate();
        };
        return RecordManager;
    }(Array));
    exports.RecordManager = RecordManager;
});

//# sourceMappingURL=record-manager.js.map
