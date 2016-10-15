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
import { Record, RecordState } from './record';
import { observable } from 'aurelia-framework';
export let RecordManager = class RecordManager {
    constructor(template) {
        this.isValid = false;
        this.isDirty = false;
        this.queryModel = { filters: [] };
        this.validationFields = [];
        this._template = template;
        this.records = new Array();
        this.currentRecord = {};
    }
    current(item) {
        this.currentRecord = item;
        if (this.currentRecord && this.currentRecord.editMode === true) {
            this.currentRecord.setValidationFields(this.validationFields).then(() => {});
        }
    }
    load(data) {
        return new Promise((resolve, reject) => {
            this.setOriginal(data);
            for (let row of data) {
                let record = new Record(row);
                record.setRecordManager(this);
                this.records.push(record);
            }
            this.isDirty = false;
            resolve();
        });
    }
    add() {
        let templateData = JSON.parse(JSON.stringify(this._template));
        let newRow = new Record(templateData, RecordState.added);
        newRow.setRecordManager(this);
        return newRow.setValidationFields(this.validationFields).then(() => {
            this.isValid = false;
            if (this.isDirty === false) {
                this.isDirty = true;
            }
            this.records.unshift(newRow);
            this.current(this.records[0]);
            for (let filter of this.queryModel.filters) {
                this.currentRecord[filter.field] = filter.value;
            }
            this.validate();
        });
    }
    edit(toggle) {
        if (this.currentRecord) {
            this.currentRecord.editMode = toggle;
            return new Promise((resolve, reject) => {
                if (toggle === true) {
                    this.currentRecord.setValidationFields(this.validationFields).then(() => this.currentRecord.validate()).then(() => {
                        resolve();
                    });
                } else {
                    resolve();
                }
            });
        }
    }
    remove(item) {
        let i = this.records.indexOf(item);
        if (item.state !== RecordState.added) {
            this.records[i].state = RecordState.deleted;
            if (this.isDirty === false) {
                this.isDirty = true;
            }
        } else {
            item.dispose();
            this.records.splice(i, 1);
        }
        this.validate();
    }
    save(changesOverride) {
        let changes = changesOverride || this.getChanges();
        if (changes.deleted.length > 0) {
            for (let row of changes.deleted) {
                let index = this.records.indexOf(row);
                this.records[index].dispose();
                this.records.splice(index, 1);
            }
        }
        for (let row of this.records) {
            row.state = RecordState.unchanged;
        }
        let originalRows = [];
        for (let row of this.records) {
            let originalRow = {},
                props = Object.getOwnPropertyNames(this._template);
            for (let field of props) {
                if (field in row) {
                    originalRow[field] = row[field];
                }
            }
            originalRows.push(originalRow);
        }
        this.originalRecords = this.setOriginal(originalRows);
        this.isDirty = false;
    }
    cancel() {
        if (this.isDirty === false) {
            return false;
        }
        let changes = this.getChanges();
        if (changes.added.length > 0) {
            for (let row of changes.added) {
                let index = this.records.indexOf(row);
                this.records[index].dispose();
                this.records.splice(index, 1);
            }
        }
        if (changes.deleted.length > 0 || changes.modified.length > 0) {
            let rows = changes.modified.concat(changes.deleted);
            let originalRows = JSON.parse(JSON.stringify(this.originalRecords));
            for (let row of rows) {
                let index = this.records.indexOf(row);
                this.records[index].dispose();
                let originalRecord = new Record(originalRows[index]);
                originalRecord.setRecordManager(this);
                this.records.splice(index, 1, originalRecord);
            }
        }
        if (this.records.length > 0) {
            this.currentRecord = this.records[0];
        } else {
            this.currentRecord = {};
        }
        this.isDirty = false;
    }
    setOriginal(data) {
        this.originalRecords = JSON.parse(JSON.stringify(data));
    }
    getOriginal() {
        return JSON.parse(JSON.stringify(this.originalRecords));
    }
    getChanges() {
        let modified = [],
            added = [],
            deleted = [];
        for (let item of this.records) {
            if (item.state === RecordState.modified) {
                modified.push(item);
            }
            if (item.state === RecordState.added) {
                added.push(item);
            }
            if (item.state === RecordState.deleted) {
                deleted.push(item);
            }
        }
        return {
            added: added,
            modified: modified,
            deleted: deleted,
            dirty: added.length > 0 || modified.length > 0 || deleted.length > 0
        };
    }
    setValidationFields(fieldNames) {
        this.validationFields = fieldNames;
    }
    validate() {
        let isValid = null;
        if (this.isDirty === false) {
            this.isValid = false;
            return;
        }
        for (let item of this.records) {
            if ((item.state === RecordState.added || item.state === RecordState.modified) && item.isValid === false) {
                isValid = false;
                break;
            }
        }
        this.isValid = isValid === null;
    }
    dispose() {
        if (this.records.length > 0) {
            for (let record of this.records) {
                record.dispose();
            }
        }
        if (this.currentRecord instanceof Record) {
            this.currentRecord.dispose();
        }
    }
};
__decorate([observable, __metadata('design:type', Object)], RecordManager.prototype, "currentRecord", void 0);
__decorate([observable(), __metadata('design:type', Boolean)], RecordManager.prototype, "isValid", void 0);
__decorate([observable(), __metadata('design:type', Boolean)], RecordManager.prototype, "isDirty", void 0);