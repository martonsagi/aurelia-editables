import { Record, RecordState } from './record';
export let RecordManager = class RecordManager extends Array {
    constructor(template) {
        super();
        this.validationStatus = {};
        this.isValid = true;
        this._template = template;
    }
    current(item) {
        this.currentRecord = item;
    }
    load(data) {
        this.setOriginal(data);
        for (let row of data) {
            let record = new Record(row);
            this.push(record);
        }
    }
    add() {
        let filters = this.filters.filter.filters,
            templateData = JSON.parse(JSON.stringify(this._template));
        let newRow = new Record(templateData, RecordState.added);
        newRow.isValid = false;
        this.isValid = false;
        this.unshift(newRow);
        this.current(this[0]);
        for (let filter of filters) {
            this.currentRecord[filter.field] = filter.value;
        }
        this.validate();
    }
    remove(item) {
        let i = this.indexOf(item);
        if (item.state !== RecordState.added) {
            this[i].state = RecordState.deleted;
        } else {
            this.splice(i, 1);
        }
        this.validate();
    }
    save(changesOverride) {
        let changes = changesOverride || this.getChanges();
        if (changes.deleted.length > 0) {
            for (let row of changes.deleted) {
                let i = this.indexOf(row);
                this.splice(i, 1);
            }
        }
        for (let row of this) {
            row.state = RecordState.unchanged;
        }
        let originalRows = [];
        for (let row of this) {
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
    }
    dirty() {
        let changes = this.getChanges();
        return changes.dirty === true;
    }
    cancel() {
        let changes = this.getChanges();
        if (changes.dirty === false) {
            return false;
        }
        if (changes.added.length > 0) {
            for (let row of changes.added) {
                let index = this.indexOf(row);
                this.splice(index, 1);
            }
        }
        if (changes.deleted.length > 0 || changes.modified.length > 0) {
            let rows = changes.modified.concat(changes.deleted);
            let originalRows = JSON.parse(JSON.stringify(this.originalRecords));
            for (let row of rows) {
                let index = this.indexOf(row);
                let originalRecord = new Record(originalRows[index]);
                this.splice(index, 1, originalRecord);
            }
        }
        if (this.length > 0) {
            this.currentRecord = this[0];
        }
    }
    setOriginal(data) {
        this.originalRecords = JSON.parse(JSON.stringify(data));
    }
    getOriginal() {
        return JSON.parse(JSON.stringify(this.originalRecords));
    }
    getChanges() {
        let modified = this.filter(item => {
            return item.state === RecordState.modified;
        });
        let added = this.filter(item => {
            return item.state === RecordState.added;
        });
        let deleted = this.filter(item => {
            return item.state === RecordState.deleted;
        });
        return {
            added: added,
            modified: modified,
            deleted: deleted,
            dirty: added.length > 0 || modified.length > 0 || deleted.length > 0
        };
    }
    validate() {
        this.isValid = true;
        let rows = this.filter(item => item.state !== RecordState.deleted);
        for (let row of rows) {
            if (row.isValid !== true) {
                this.isValid = false;
            }
        }
    }
    validateCurrentRecord() {
        let isValid = true;
        for (let field in this.validationStatus) {
            if (this.validationStatus[field] === false) {
                isValid = false;
            }
        }
        this.currentRecord.isValid = isValid;
    }
    setValidationStatus(field, isValid) {
        this.validationStatus[field] = isValid;
        this.validateCurrentRecord();
        this.validate();
    }
};