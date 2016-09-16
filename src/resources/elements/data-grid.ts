﻿//#region import

import { bindable, autoinject, ViewCompiler, Container, BindingEngine } from 'aurelia-framework';
import { DataObjectViewModel, DataObjectPagingViewModel, QueryModel } from 'aurelia-editables';
import { Config } from '../../config';
import { Api } from '../../api';
import { Pager } from './pager';
import { Record, RecordState } from '../../record';
import { RecordManager } from '../../record-manager';

//#endregion

@autoinject
export class DataGrid {

    //#region Bindables

    @bindable options: DataObjectViewModel;

    @bindable records: any;

    @bindable currentRecord: Record | null = null;

    @bindable parentRecord: Record | null = null;

    @bindable entity;

    @bindable editMode: boolean = false;

    @bindable formMode: boolean = false;

    @bindable showFormOnCreate: boolean = false;

    @bindable childMode: boolean = false;

    @bindable canLoad: boolean = false;

    @bindable showToolbar: boolean = true;

    //#endregion

    //#region Bindable events

    /*private _events: any = {
        'on-created': null,
        'on-bind': null,
        'on-attached': null,
        'on-init': null,
        'on-before-load': null,
        'on-after-load': null,
        'on-record-add': null,
        'on-record-edit': null,
        'on-record-remove': null,
        'on-record-changed': null,
        'on-record-validated': null,
        'on-recordManager-changed': null,
        'on-before-validate': null,
        'on-after-validate': null,
        'on-before-save-': null,
        'on-after-save': null,
        'on-before-cancel': null,
        'on-after-cancel': null,
        'on-refresh': null,
        'on-filter': null,
        'on-sort': null,
        'on-select': null,
        'on-form-show': null,
        'on-form-hide': null,
        'on-page-changed': null
    };*/

    //#endregion

    //#region Properties

    recordManager: RecordManager | null = new RecordManager();
    element: Element;
    loader: any;
    table: any;
    tableContainer: any;

    api: Api;
    apiClass: any;
    loading: boolean;
    viewCompiler: ViewCompiler;

    queryModel: QueryModel = { filters: []  };
    columnFilters: Array<any> = null;
    filterVisible = false;
    sortSettings = null;
    
    pageSettings: DataObjectPagingViewModel = { current: 1, size: 10 };
    pager: any;
    total;

    validationStatus = {};
    isValid = true;

    pluginConfig: Config;

    //#endregion

    constructor(element: Element, viewCompiler: ViewCompiler) {
        this.element = element;
        this.viewCompiler = viewCompiler;

        this.pluginConfig = Container.instance.get(Config);
        this.apiClass = this.pluginConfig.api;

        //let locator = <BindingEngine>Container.instance.get(BindingEngine);
        //locator
        //    .collectionObserver(this.recordManager.records)
        //    .subscribe(this.onRecordsChange.bind(this));

        this.dispatch('on-created', { viewModel: this });
    }

    //#region au events

    created() {
    }

    bind(bindingContext) {
        this.dispatch('on-bind', { viewModel: this, context: bindingContext});
    }

    attached() {
        this.dispatch('on-attached', { viewModel: this });
        let canLoad = this.parentRecord === null || this.canLoad === true;
        this.init(canLoad);
    }

    detached() {

    }

    unbind() {
        this.editMode = false;
    }

    //#endregion

    //#region Data Initialization (Data loading, refresh)

    init(canLoad) {
        this.dispatch('on-init', { viewModel: this });

        this.pageSettings = this.options.paging || this.pageSettings;
        this.pageSettings.size = this.pageSettings.size || 10;

        this.api = new this.apiClass(this.options.api);
        this.loadColumns().then(() => {
            if (canLoad === true)
                this.load();
        });
    }

    load() {
        this.dispatch('on-before-load', { viewModel: this });

        let t = this;
        t.loading = true;  
        t.setLoader();      
        //t.sortSettings = null;
        let childOptions = this.options.childOptions,
            filterOptions = this.queryModel.filters;

        this.queryModel.page = this.pageSettings.current;
        this.queryModel.skip = (this.pageSettings.current - 1) * this.pageSettings.size;
        this.queryModel.take = this.pageSettings.size;

        if (this.parentRecord !== null) {
            let parentFilter = {
                field: childOptions.childFieldName,
                value: this.parentRecord[childOptions.parentFieldName],
                operator: "eq"
            };

            let checkFilter = filterOptions.filter(item => {
                return item.field === childOptions.childFieldName;
            });

            if (checkFilter.length === 0) {
                filterOptions.push(parentFilter);
            } else {
                let checkIndex = filterOptions.indexOf(checkFilter[0]);
                filterOptions[checkIndex] = parentFilter;
            }
        }

        t.api.read(this.queryModel)
            .then(result => {
                t.entity = result.entity;

                if (t.columnFilters === null)
                    t.columnFilters = JSON.parse(JSON.stringify(this.entity));

                if (this.parentRecord !== null) {
                    t.columnFilters[childOptions.childFieldName] = this.parentRecord[childOptions.parentFieldName];
                }

                t.total = result.total;

                t.recordManager = new RecordManager(t.entity);
                console.log(t.recordManager);
                t.recordManager.queryModel = t.queryModel;
                t.recordManager.load(result.data);

                t.select(t.recordManager[0]);
                //setTimeout(() => t.loading = false, 1000);
                t.loading = false;

                this.dispatch('on-after-load', { viewModel: t });
            });
    }

    setLoader() {
        let table = this.table,
            tableContainer = this.tableContainer,
            loader = this.loader;

        let width = table.style.width > tableContainer.style.width ? tableContainer.style.width : table.style.width,
            height = table.style.height > tableContainer.style.height ? tableContainer.style.height : table.style.height;

        loader.style.width = width + 'px';
        loader.style.height = height + 'px';

        loader.querySelector('.spinner').style.marginTop = (tableContainer.style.height / 2) + 'px';
    }

    loadColumns() {
        let t = this;
        return new Promise(function (resolve, reject) {
            let tasks = [];

            for (let column of t.options.columns) {
                let editorSettings = column.editor;

                let callApi = editorSettings && "api" in editorSettings && editorSettings.api !== null && editorSettings.api.length > 0;

                if (!callApi) {
                    if (!editorSettings)
                        column.editor = { values: <Array<any>>[] };
                } else {
                    let editorApi = new Api(editorSettings.api);
                    let task = editorApi.get().then(result => {
                        editorSettings.values = result;
                    });

                    tasks.push(task);
                }
            }

            if (tasks.length > 0) {
                Promise.all(tasks).then(() => {
                    resolve();
                })
                .catch(e => reject(e));
            } else {
                resolve();
            }
        });
    }

    refresh() {
        this.dispatch('on-refresh', { viewModel: this });

        if (this.cancel(true) === false) {
            return false;
        }

        let refreshColumns = this.options.refreshColumns || false;

        if (refreshColumns) {
            this.loadColumns().then(() => {
                this.load();
            });
        } else {
            this.load();
        }
    }

    //#endregion

    //#region Filtering/Sorting features

    setFilter(column) {
        this.dispatch('on-filter', { viewModel: this });

        let found = false,
            filters = this.queryModel.filters,
            operator = "contains",
            filterValue = this.columnFilters[column];

        let columnSettings = this.options.columns.filter(col => {
            return col.name === column;
        });

        if (columnSettings.length > 0 && "type" in columnSettings[0]) {
            switch (columnSettings[0].type) {
                case "boolean":
                    operator = "eq";
                    filterValue = filterValue ? true : false;
                    break;
            }            
        }

        for (let filter of filters) {
            if (filter.field === column) {
                if (filterValue !== null && filterValue.length > 0) {
                    filter = { field: column, value: filterValue, operator: operator };
                } else {
                    let index = filters.indexOf(filter);
                    filters.splice(index, 1);
                }

                found = true;
            }
        }

        if (found) {
            this.refresh();
        }

        if (!found && filterValue !== null && filterValue.length > 0) {
            filters.push({ field: column, value: filterValue, operator: operator });

            this.refresh();
        }
    }

    toggleFilter() {
        this.filterVisible = !this.filterVisible;
    }

    sort(fieldName) {
        this.dispatch('on-sort', { viewModel: this });

        let canSort = this.options.sorting || false;

        if (canSort === false)
            return;

        if (this.sortSettings !== null && this.sortSettings.field === fieldName && this.sortSettings.dir === 'desc') {
            this.sortSettings = null;
            this.queryModel.sort = null;
        } else {
            let order = this.sortSettings === null || this.sortSettings.field !== fieldName ? 'asc' : this.sortSettings.dir === 'asc' ? 'desc' : 'asc';

            this.sortSettings = { field: fieldName, dir: order };
            this.queryModel.sort = [{ field: fieldName, dir: order }];
        }

        this.refresh();
    }

    //#endregion

    //#region Basic features (Selection, Pager)

    select(rec) {
        this.dispatch('on-select', { viewModel: this });

        if (this.currentRecord)
            this.currentRecord.editMode = false;

        this.recordManager.current(rec);
        this.currentRecord = this.recordManager.currentRecord;

        if (this.currentRecord)
            this.currentRecord.editMode = this.editMode;

        if (this.editMode === true) {
            this.validate();
        }

        return true;
    }

    changePage(newPage, newSize) {
        if (this.cancel(true) === false) {
            return false;
        }

        this.pageSettings.current = newPage;
        this.pageSettings.size = newSize;

        this.dispatch('on-page-changed', { newPage: newPage, newSize: newSize, viewModel: this });

        this.load();

        return true;
    }

    //#endregion

    //#region Editing features

    add() {
        this.recordManager.add();

        this.editMode = true;
        this.formMode = this.formMode !== true ? this.showFormOnCreate === true : this.formMode;
        this.isValid = false;

        this.select(this.recordManager.currentRecord);
        this.dispatch('on-record-add', { viewModel: this });
    }

    edit() {
        this.editMode = true;
        if (this.currentRecord) {
            this.currentRecord.editMode = this.editMode;
        }

        this.dispatch('on-record-edit', { viewModel: this });
    }

    editForm(rec) {
        this.formMode = true;
        this.select(rec);

        this.dispatch('on-form-show', { viewModel: this });
    }

    endEditForm() {
        this.formMode = false;
        this.dispatch('on-form-hide', { viewModel: this });
    }

    remove(item: Record) {
        this.dispatch('on-record-remove', { viewModel: this, record: item });

        this.recordManager.remove(item);
    }

    save() {
        let t = this,
            changes = t.getChanges();

        this.dispatch('on-before-save', { viewModel: this, changes: changes });

        let tasks = [];

        if (changes.added.length > 0) {
            let addedTask = this.api.create({ models: changes.added })
                .then(() => {
                })
                .catch(e => console.log(e));

            tasks.push(addedTask);
        }

        if (changes.modified.length > 0) {
            let modifiedTask = this.api.update({ models: changes.modified })
                .then(() => {

                })
                .catch(e => console.log(e));

            tasks.push(modifiedTask);
        }

        if (changes.deleted.length > 0) {
            let deletedTask = this.api.destroy({ models: changes.deleted })
                .then(() => {
                })
                .catch(e => console.log(e));

            tasks.push(deletedTask);
        }

        let reqs = Promise.all(tasks);

        reqs.then(() => {
            t.recordManager.save(changes);

            if (changes.added.length > 0) {
                t.total += changes.added.length;
            }

            if (changes.deleted.length > 0 || changes.added.length > 0) {
                (<Pager>this.pager.au.controller.viewModel).update();
            }

            if (this.currentRecord) {
                this.currentRecord.editMode = false;
            }
            this.editMode = false;

            this.dispatch('on-after-save', { viewModel: this });
        });
    }

    cancel(showConfirm: boolean | null) {
        let isDirty = this.recordManager.dirty();

        if (showConfirm === true && isDirty === true) {
            if (!confirm('You have unsaved changes. Are you sure you wish to leave?')) {
                return false;
            }
        }

        let changes = this.getChanges();
        this.dispatch('on-before-cancel', { viewModel: this, changes: changes });

        if (isDirty === true)
            this.recordManager.cancel();

        this.editMode = false;
        if (this.currentRecord) {
            this.currentRecord.editMode = false;
            this.select(this.recordManager.currentRecord);
        }

        this.formMode = false;
        this.isValid = true;

        this.dispatch('on-after-cancel', { viewModel: this });
    }

    onRecordsChange(splice) {
        this.dispatch('on-records-changed', { viewModel: this, changes: splice });
        //console.log("Records changed");
    }

    getChanges() {
        let modified = this.recordManager.records.filter(item => {
            return item.state === RecordState.modified;
        });

        let added = this.recordManager.records.filter(item => {
            return item.state === RecordState.added;
        });

        let deleted = this.recordManager.records.filter(item => {
            return item.state === RecordState.deleted;
        });

        return {
            added: added,
            modified: modified,
            deleted: deleted,
            dirty: added.length > 0 || modified.length > 0 || deleted.length > 0
        };
    }

    //#endregion

    //#region Validation

    validate() {
        this.dispatch('on-before-validate', { viewModel: this });

        this.recordManager.validate();

        this.dispatch('on-after-validate', { viewModel: this });
    }

    validateCurrentRecord() {
        this.recordManager.validateCurrentRecord();

        this.dispatch('on-record-validated', { viewModel: this });
    }

    setValidationStatus(field, isValid) {
        this.recordManager.setValidationStatus(field, isValid);
        this.isValid = this.recordManager.isValid;
    }

    //#endregion

    //#region Parent/Child Grid feature

    showChildren(rec) {
        this.childMode = true;
        this.select(rec);
    }

    hideChildren() {
        this.childMode = false;
    }

    parentRecordChanged() {
        this.refresh();
    }

    //#endregion

    //#region Column resizing

    resizeColumn(customEvent) {
        let event = customEvent.detail,
            target = event.target,
            x = (parseFloat(target.getAttribute('data-x')) || 0),
            y = (parseFloat(target.getAttribute('data-y')) || 0),
            data = target.dataset;

        if (event.rect.width < 100)
            return;

        // update the element's style
        target.style.width = event.rect.width + 'px';
        //target.style.height = event.rect.height + 'px';

        let selector = `.td-${data.col}`;
        target.style.width = event.rect.width
        target.style.maxWidth = event.rect.width + 'px';

        // translate when resizing from top or left edges
        x += event.deltaRect.left;
        y += event.deltaRect.top;

        target.style.webkitTransform = target.style.transform =
            'translate(' + x + 'px,' + y + 'px)';

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    }

    //#endregion

    //#region Events

    dispatch(name, data) {
        this.element.dispatchEvent(
            new CustomEvent(name, {
                bubbles: true,
                detail: data
            })
        );
    }

    //#endregion
}