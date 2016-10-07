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
import { bindable, autoinject, Container } from 'aurelia-framework';
import { Config } from '../../config';
import { Api } from '../../api';
import { RecordState } from '../../record';
import { RecordManager } from '../../record-manager';
import { DeepObserver } from '../../deep-observer';
export let DataGrid = class DataGrid {
    constructor(element, deepObserver) {
        this.parentRecord = null;
        this.editMode = false;
        this.formMode = false;
        this.showFormOnCreate = false;
        this.childMode = false;
        this.canLoad = false;
        this.showToolbar = true;
        this.filterVisible = false;
        this.queryModel = { filters: [] };
        this.columnFilters = null;
        this.sortSettings = null;
        this.pageSettings = { current: 1, size: 10 };
        this.element = element;
        this.deepObserver = deepObserver;
        this.deepObserverDisposer = this.deepObserver.observe(this, 'options', this.optionsChanged.bind(this));
        this.pluginConfig = Container.instance.get(Config);
        this.apiClass = this.pluginConfig.api;
        this.gridModel = this;
        this.dispatch('on-created', { viewModel: this });
    }
    get toolbarTemplateOption() {
        return this.options.toolbarTemplate || this.toolbarTemplate || './data-grid-toolbar';
    }
    created() {}
    bind(bindingContext) {
        this.dispatch('on-bind', { viewModel: this, context: bindingContext });
        this.recordManager = new RecordManager();
        this.recordManager.load([{}]);
    }
    attached() {
        this.dispatch('on-attached', { viewModel: this });
        let canLoad = this.parentRecord === null || this.canLoad === true;
        this.init(canLoad);
    }
    detached() {}
    unbind() {
        this.editMode = false;
        this.deepObserverDisposer();
        this.recordManagerDisposer();
    }
    init(canLoad) {
        this.dispatch('on-init', { viewModel: this });
        this.pageSettings = this.options.paging || this.pageSettings;
        this.pageSettings.size = this.pageSettings.size || 10;
        this.api = new this.apiClass(this.options.api);
        this.loadColumns().then(() => {
            if (canLoad === true) this.load();
        });
    }
    load() {
        this.dispatch('on-before-load', { viewModel: this });
        let t = this;
        t.loading = true;
        t.setLoader();
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
        t.api.read(this.queryModel).then(result => {
            t.entity = result.entity;
            if (t.columnFilters === null) t.columnFilters = JSON.parse(JSON.stringify(this.entity));
            if (this.parentRecord !== null) {
                t.columnFilters[childOptions.childFieldName] = this.parentRecord[childOptions.parentFieldName];
            }
            t.total = result.total;
            t.recordManagerDisposer();
            t.loadValidationFields();
            t.recordManager = new RecordManager(t.entity);
            t.recordManager.queryModel = t.queryModel;
            t.recordManager.setValidationFields(t.validationFields);
            t.recordManager.load(result.data);
            t.select(t.recordManager.records[0]);
            t.loading = false;
            this.dispatch('on-after-load', { viewModel: t });
        });
    }
    setLoader() {
        let table = this.tableBody,
            tableContainer = this.tableContainer,
            loader = this.loader;
        let width = table.offsetWidth > tableContainer.offsetWidth ? tableContainer.offsetWidth : table.offsetWidth,
            height = table.offsetHeight > tableContainer.offsetHeight ? tableContainer.offsetHeight : table.offsetHeight;
        loader.style.width = width + 'px';
        loader.style.height = height + 'px';
        loader.querySelector('.spinner').style.marginTop = tableContainer.offsetHeight / 2 + 'px';
    }
    loadColumns() {
        let t = this;
        return new Promise(function (resolve, reject) {
            let tasks = [];
            for (let column of t.options.columns) {
                let editorSettings = column.editor;
                let callApi = editorSettings && "api" in editorSettings && editorSettings.api !== null && editorSettings.api.length > 0;
                if (!callApi) {
                    if (!editorSettings) column.editor = { values: [] };
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
                }).catch(e => reject(e));
            } else {
                resolve();
            }
        });
    }
    loadValidationFields() {
        let fields = this.options.columns.filter(col => col.validation).map(col => col.name);
        this.validationFields = fields;
    }
    recordManagerDisposer() {
        if (this.recordManager.records && this.recordManager.records.length > 0) {
            this.recordManager.dispose();
        }
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
        if (canSort === false) return;
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
    select(rec) {
        this.dispatch('on-select', { viewModel: this });
        if (this.recordManager.currentRecord) this.recordManager.currentRecord.editMode = false;
        if (rec) {
            rec.editMode = this.editMode || this.formMode;
        }
        this.recordManager.current(rec);
        this.validate();
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
    add() {
        this.editMode = true;
        this.formMode = this.formMode !== true ? this.showFormOnCreate === true : this.formMode;
        this.recordManager.add().then(() => {
            this.select(this.recordManager.currentRecord);
            this.dispatch('on-record-add', { viewModel: this });
        });
    }
    edit() {
        this.editMode = !this.editMode;
        this.recordManager.edit(this.editMode).then(() => {
            if (this.editMode === true) {
                this.dispatch('on-record-edit-begin', { viewModel: this });
            } else {
                this.dispatch('on-record-edit-end', { viewModel: this });
            }
        });
    }
    editForm(rec) {
        this.formMode = true;
        this.select(rec);
        this.dispatch('on-record-edit-begin', { viewModel: this });
    }
    endEditForm() {
        this.formMode = false;
        this.recordManager.currentRecord.editMode = this.editMode || this.formMode;
        this.dispatch('on-record-edit-end', { viewModel: this });
    }
    remove(item) {
        this.dispatch('on-record-remove', { viewModel: this, record: item });
        this.recordManager.remove(item);
    }
    save() {
        let t = this,
            changes = t.getChanges();
        this.dispatch('on-before-save', { viewModel: this, changes: changes });
        let tasks = [];
        if (changes.added.length > 0) {
            let addedTask = this.api.create({ models: changes.added }).then(() => {}).catch(e => console.log(e));
            tasks.push(addedTask);
        }
        if (changes.modified.length > 0) {
            let modifiedTask = this.api.update({ models: changes.modified }).then(() => {}).catch(e => console.log(e));
            tasks.push(modifiedTask);
        }
        if (changes.deleted.length > 0) {
            let deletedTask = this.api.destroy({ models: changes.deleted }).then(() => {}).catch(e => console.log(e));
            tasks.push(deletedTask);
        }
        let reqs = Promise.all(tasks);
        reqs.then(() => {
            t.recordManager.save(changes);
            if (changes.added.length > 0) {
                t.total += changes.added.length;
            }
            if (changes.deleted.length > 0 || changes.added.length > 0) {
                this.pager.au.controller.viewModel.update();
            }
            if (this.recordManager.currentRecord) {
                this.recordManager.currentRecord.editMode = false;
            }
            this.editMode = false;
            this.dispatch('on-after-save', { viewModel: this });
        });
    }
    cancel(showConfirm) {
        let isDirty = this.recordManager.dirty();
        if (showConfirm === true && isDirty === true) {
            if (!confirm('You have unsaved changes. Are you sure you wish to leave?')) {
                return false;
            }
        }
        let changes = this.getChanges();
        this.dispatch('on-before-cancel', { viewModel: this, changes: changes });
        if (isDirty === true) this.recordManager.cancel();
        this.editMode = false;
        if (this.recordManager.currentRecord) {
            this.recordManager.currentRecord.editMode = false;
            this.select(this.recordManager.currentRecord);
        }
        this.formMode = false;
        this.dispatch('on-after-cancel', { viewModel: this });
    }
    onRecordsChange(splice) {
        this.dispatch('on-records-changed', { viewModel: this, changes: splice });
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
    validate() {
        this.dispatch('on-before-validate', { viewModel: this });
        this.recordManager.validate();
        this.dispatch('on-after-validate', { viewModel: this });
    }
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
    resizeColumn(customEvent, column) {
        let event = customEvent.detail,
            target = event.target,
            x = parseFloat(target.getAttribute('data-x')) || 0,
            y = parseFloat(target.getAttribute('data-y')) || 0,
            data = target.dataset;
        if (column.resizing === false) return;
        if (event.rect.width < 100) return;
        column.width = event.rect.width - 16;
        x += event.deltaRect.left;
        y += event.deltaRect.top;
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    }
    optionsChanged(newValue, oldValue, property) {
        this.dispatch('on-options-changed', {
            viewModel: this,
            newValue: newValue,
            oldValue: oldValue,
            property: property
        });
    }
    onScroll(event) {
        this.tableHeaderScroll.scrollLeft = event.target.scrollLeft;
    }
    dispatch(name, data) {
        this.element.dispatchEvent(new CustomEvent(name, {
            bubbles: true,
            detail: data
        }));
    }
};
__decorate([bindable, __metadata('design:type', Object)], DataGrid.prototype, "options", void 0);
__decorate([bindable, __metadata('design:type', Object)], DataGrid.prototype, "parentRecord", void 0);
__decorate([bindable, __metadata('design:type', Object)], DataGrid.prototype, "entity", void 0);
__decorate([bindable, __metadata('design:type', Boolean)], DataGrid.prototype, "editMode", void 0);
__decorate([bindable, __metadata('design:type', Boolean)], DataGrid.prototype, "formMode", void 0);
__decorate([bindable, __metadata('design:type', Boolean)], DataGrid.prototype, "showFormOnCreate", void 0);
__decorate([bindable, __metadata('design:type', Boolean)], DataGrid.prototype, "childMode", void 0);
__decorate([bindable, __metadata('design:type', Boolean)], DataGrid.prototype, "canLoad", void 0);
__decorate([bindable, __metadata('design:type', Boolean)], DataGrid.prototype, "showToolbar", void 0);
__decorate([bindable, __metadata('design:type', Boolean)], DataGrid.prototype, "filterVisible", void 0);
__decorate([bindable, __metadata('design:type', String)], DataGrid.prototype, "toolbarTemplate", void 0);
__decorate([bindable, __metadata('design:type', Object)], DataGrid.prototype, "gridModel", void 0);
DataGrid = __decorate([autoinject, __metadata('design:paramtypes', [Element, DeepObserver])], DataGrid);