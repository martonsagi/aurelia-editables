import { Record, RecordState } from './record';
import { observable } from 'aurelia-framework';
import { QueryModel } from 'aurelia-editables';

export class RecordManager {

    private _template: any;

    currentRecord: Record | null;
    queryModel: QueryModel = { filters: []  };
    originalRecords: any;
    validationStatus = {};
    isValid: boolean = true;

    @observable()
    records: Array<Record>;

    constructor(template?: any) {
        this._template = template;
        this.records = new Array<Record>();
    }

    current(item: Record) {
        this.currentRecord = item;
    }

    load(data) {
        this.setOriginal(data);

        for (let row of data) {
            let record = new Record(row);
            this.records.push(record);
        }
    }

    add() {
        let templateData = JSON.parse(JSON.stringify(this._template));

        let newRow = new Record(templateData, RecordState.added);
        newRow.isValid = false;
        this.isValid = false;

        this.records.unshift(newRow);
        this.current(this.records[0]);

        for (let filter of this.queryModel.filters) {
            this.currentRecord[filter.field] = filter.value;
        }

        this.validate();
    }

    remove(item: Record) {
        let i = this.records.indexOf(item);

        if (item.state !== RecordState.added) {
            this.records[i].state = RecordState.deleted;
        } else {
            this.records.splice(i, 1);
        }

        this.validate();
    }

    save(changesOverride?: any) {
        let changes = changesOverride || this.getChanges();
        if (changes.deleted.length > 0) {
            for (let row of changes.deleted) {
                let i = this.records.indexOf(row);
                this.records.splice(i, 1);
            }
        }

        for (let row of this.records) {
            row.state = RecordState.unchanged;
        }

        let originalRows = [];
        for (let row of this.records) {
            let originalRow = {},
                props: Array<string> = Object.getOwnPropertyNames(this._template);

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

        // removing newly added recordManager, so array indexes should be restored
        if (changes.added.length > 0) {
            for (let row of changes.added) {
                let index = this.records.indexOf(row);
                this.records.splice(index, 1);
            }
        }

        // restoring modified/deleted recordManager
        // deleted recordManager should be treated as modified ones,
        // because before deletion modifications can occur
        if (changes.deleted.length > 0 || changes.modified.length > 0 ) {
            let rows = changes.modified.concat(changes.deleted);
            let originalRows = JSON.parse(JSON.stringify(this.originalRecords));

            for (let row of rows) {
                let index = this.records.indexOf(row);
                let originalRecord = new Record(originalRows[index]);
                this.records.splice(index, 1, originalRecord);
            }
        }

        if (this.records.length > 0) {
            this.currentRecord = this.records[0];
        }
    }

    setOriginal(data) {
        this.originalRecords = JSON.parse(JSON.stringify(data));
    }

    getOriginal() {
        return JSON.parse(JSON.stringify(this.originalRecords));
    }

    getChanges() {
        let modified = this.records.filter(item => {
            return item.state === RecordState.modified;
        });

        let added = this.records.filter(item => {
            return item.state === RecordState.added;
        });

        let deleted = this.records.filter(item => {
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
        let rows = this.records.filter(item => item.state !== RecordState.deleted);
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
}
