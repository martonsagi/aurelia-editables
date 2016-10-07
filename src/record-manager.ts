import { Record, RecordState } from './record';
import { observable } from 'aurelia-framework';
import { QueryModel } from 'aurelia-editables';

export class RecordManager {

    private _template: any;

    @observable
    currentRecord: Record | null;

    @observable()
    isValid: boolean = false;

    records: Array<Record>;
    queryModel: QueryModel = { filters: []  };
    originalRecords: any;
    validationFields: Array<string> = [];

    constructor(template?: any) {
        this._template = template;
        this.records = new Array<Record>();
        this.currentRecord = (<any>{});
    }

    current(item: Record) {
        this.currentRecord = item;
        if (this.currentRecord.editMode === true) {
            this.currentRecord.setValidationFields(this.validationFields);
        }
    }

    load(data) {
        this.setOriginal(data);

        for (let row of data) {
            let record = new Record(row);
            record.setRecordManager(this);
            this.records.push(record);
        }
    }

    add() {
        let templateData = JSON.parse(JSON.stringify(this._template));

        let newRow = new Record(templateData, RecordState.added);
        newRow.setRecordManager(this);
        if (this.validationFields && this.validationFields.length > 0) {
            newRow.setValidationFields(this.validationFields);
        }

        //newRow.isValid = false;
        this.isValid = false;

        this.records.unshift(newRow);
        this.current(this.records[0]);

        for (let filter of this.queryModel.filters) {
            this.currentRecord[filter.field] = filter.value;
        }

        this.validate();
    }

    edit(toggle) {
        if (toggle === true) {
            if (this.currentRecord) {
                // loaded records have no validation by default to enhance performance
                // initialize record validation when it goes into edit mode
                this.currentRecord.setValidationFields(this.validationFields);

                this.currentRecord.editMode = true;
                this.currentRecord.validate();
            }
        } else {
            if (this.currentRecord) {
                this.currentRecord.editMode = false;
            }
        }
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

        // removing newly added records, so array indexes should be restored
        if (changes.added.length > 0) {
            for (let row of changes.added) {
                let index = this.records.indexOf(row);
                this.records.splice(index, 1);
            }
        }

        // restoring modified/deleted records
        // deleted records should be treated as modified ones,
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
        } else {
            this.currentRecord = (<any>{});
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

    setValidationFields(fieldNames: Array<string>) {
        this.validationFields = fieldNames;
    }

    validate() {
        this.isValid = false;

        if (this.dirty() === false) {
            return;
        }

        let rows = this.records.filter(item =>
            (item.state === RecordState.added || item.state === RecordState.modified)
            &&
            item.isValid === false
        );

        this.isValid = rows.length === 0;
    }
}
