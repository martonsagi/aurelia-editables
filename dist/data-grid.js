var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", 'aurelia-framework', './config', './api', './record', './record-manager', 'lodash', 'jquery'], function (require, exports, aurelia_framework_1, config_1, api_1, record_1, record_manager_1, _) {
    "use strict";
    var DataGrid = (function () {
        function DataGrid(element, viewCompiler) {
            this.records = new record_manager_1.RecordManager();
            this.currentRecord = null;
            this.parentRecord = null;
            this.editMode = false;
            this.formMode = false;
            this.showFormOnCreate = false;
            this.childMode = false;
            this.canLoad = false;
            this.showToolbar = true;
            this.queryModel = { filters: [] };
            this.columnFilters = null;
            this.filterVisible = false;
            this.sortSettings = null;
            this.pageSettings = { current: 1, size: 10 };
            this.validationStatus = {};
            this.isValid = true;
            this.element = element;
            this.viewCompiler = viewCompiler;
            this.pluginConfig = aurelia_framework_1.Container.instance.get(config_1.Config);
            this.apiClass = this.pluginConfig.api;
            var locator = aurelia_framework_1.Container.instance.get(aurelia_framework_1.BindingEngine);
            locator
                .collectionObserver(this.records)
                .subscribe(this.onRecordsChange.bind(this));
            this.dispatch('on-created', { viewModel: this });
        }
        DataGrid.prototype.created = function () {
        };
        DataGrid.prototype.bind = function (bindingContext) {
            this.dispatch('on-bind', { viewModel: this, context: bindingContext });
        };
        DataGrid.prototype.attached = function () {
            this.dispatch('on-attached', { viewModel: this });
            var canLoad = this.parentRecord === null || this.canLoad === true;
            this.init(canLoad);
        };
        DataGrid.prototype.detached = function () {
        };
        DataGrid.prototype.unbind = function () {
            this.editMode = false;
        };
        DataGrid.prototype.init = function (canLoad) {
            var _this = this;
            this.dispatch('on-init', { viewModel: this });
            this.pageSettings = this.options.paging || this.pageSettings;
            this.pageSettings.size = this.pageSettings.size || 10;
            this.api = new this.apiClass(this.options.api);
            this.loadColumns().then(function () {
                if (canLoad === true)
                    _this.load();
            });
        };
        DataGrid.prototype.load = function () {
            var _this = this;
            this.dispatch('on-before-load', { viewModel: this });
            var t = this;
            t.loading = true;
            t.setLoader();
            var childOptions = this.options.childOptions, filterOptions = this.queryModel.filters;
            this.queryModel.page = this.pageSettings.current;
            this.queryModel.skip = (this.pageSettings.current - 1) * this.pageSettings.size;
            this.queryModel.take = this.pageSettings.size;
            if (this.parentRecord !== null) {
                var parentFilter = {
                    field: childOptions.childFieldName,
                    value: this.parentRecord[childOptions.parentFieldName],
                    operator: "eq"
                };
                var checkFilter = filterOptions.filter(function (item) {
                    return item.field === childOptions.childFieldName;
                });
                if (checkFilter.length === 0) {
                    filterOptions.push(parentFilter);
                }
                else {
                    var checkIndex = filterOptions.indexOf(checkFilter[0]);
                    filterOptions[checkIndex] = parentFilter;
                }
            }
            t.api.read(this.queryModel)
                .then(function (result) {
                t.entity = result.entity;
                if (t.columnFilters === null)
                    t.columnFilters = JSON.parse(JSON.stringify(_this.entity));
                if (_this.parentRecord !== null) {
                    t.columnFilters[childOptions.childFieldName] = _this.parentRecord[childOptions.parentFieldName];
                }
                t.total = result.total;
                t.records = new record_manager_1.RecordManager(t.entity);
                t.records.filters = t.queryModel;
                t.records.load(result.data);
                t.select(t.records[0]);
                t.loading = false;
                _this.dispatch('on-after-load', { viewModel: t });
            });
        };
        DataGrid.prototype.setLoader = function () {
            var table = $(this.table), tableContainer = $(this.tableContainer), loader = $(this.loader);
            var width = table.width() > tableContainer.width() ? tableContainer.width() : table.width(), height = table.height() > tableContainer.height() ? tableContainer.height() : table.height();
            loader.css({
                'width': width + 'px',
                'height': height + 'px',
            });
            loader.find('.spinner').css('margin-top', tableContainer.height() / 2 + 'px');
        };
        DataGrid.prototype.loadColumns = function () {
            var t = this;
            return new Promise(function (resolve, reject) {
                var tasks = [];
                var _loop_1 = function(column) {
                    var editorSettings = column.editor;
                    var callApi = editorSettings && "api" in editorSettings && editorSettings.api !== null && editorSettings.api.length > 0;
                    if (!callApi) {
                        if (!editorSettings)
                            column.editor = { values: [] };
                    }
                    else {
                        var editorApi = new api_1.Api(editorSettings.api);
                        var task = editorApi.get().then(function (result) {
                            editorSettings.values = result;
                        });
                        tasks.push(task);
                    }
                };
                for (var _i = 0, _a = t.options.columns; _i < _a.length; _i++) {
                    var column = _a[_i];
                    _loop_1(column);
                }
                if (tasks.length > 0) {
                    Promise.all(tasks).then(function () {
                        resolve();
                    })
                        .catch(function (e) { return reject(e); });
                }
                else {
                    resolve();
                }
            });
        };
        DataGrid.prototype.refresh = function () {
            var _this = this;
            this.dispatch('on-refresh', { viewModel: this });
            if (this.cancel(true) === false) {
                return false;
            }
            var refreshColumns = this.options.refreshColumns || false;
            if (refreshColumns) {
                this.loadColumns().then(function () {
                    _this.load();
                });
            }
            else {
                this.load();
            }
        };
        DataGrid.prototype.setFilter = function (column) {
            this.dispatch('on-filter', { viewModel: this });
            var found = false, filters = this.queryModel.filters, operator = "contains", filterValue = this.columnFilters[column];
            var columnSettings = _.find(this.options.columns, function (col) {
                return col.name === column;
            });
            if (columnSettings && "type" in columnSettings) {
                switch (columnSettings.type) {
                    case "boolean":
                        operator = "eq";
                        filterValue = filterValue ? true : false;
                        break;
                }
            }
            for (var _i = 0, filters_1 = filters; _i < filters_1.length; _i++) {
                var filter = filters_1[_i];
                if (filter.field === column) {
                    if (filterValue !== null && filterValue.length > 0) {
                        filter = { field: column, value: filterValue, operator: operator };
                    }
                    else {
                        var index = filters.indexOf(filter);
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
        };
        DataGrid.prototype.toggleFilter = function () {
            this.filterVisible = !this.filterVisible;
        };
        DataGrid.prototype.sort = function (fieldName) {
            this.dispatch('on-sort', { viewModel: this });
            var canSort = this.options.sorting || false;
            if (canSort === false)
                return;
            if (this.sortSettings !== null && this.sortSettings.field === fieldName && this.sortSettings.dir === 'desc') {
                this.sortSettings = null;
                this.queryModel.sort = null;
            }
            else {
                var order = this.sortSettings === null || this.sortSettings.field !== fieldName ? 'asc' : this.sortSettings.dir === 'asc' ? 'desc' : 'asc';
                this.sortSettings = { field: fieldName, dir: order };
                this.queryModel.sort = [{ field: fieldName, dir: order }];
            }
            this.refresh();
        };
        DataGrid.prototype.select = function (rec) {
            this.dispatch('on-select', { viewModel: this });
            if (this.currentRecord)
                this.currentRecord.editMode = false;
            this.records.current(rec);
            this.currentRecord = this.records.currentRecord;
            if (this.currentRecord)
                this.currentRecord.editMode = this.editMode;
            if (this.editMode === true) {
                this.validate();
            }
            return true;
        };
        DataGrid.prototype.changePage = function (newPage, newSize) {
            if (this.cancel(true) === false) {
                return false;
            }
            this.pageSettings.current = newPage;
            this.pageSettings.size = newSize;
            this.dispatch('on-page-changed', { newPage: newPage, newSize: newSize, viewModel: this });
            this.load();
            return true;
        };
        DataGrid.prototype.add = function () {
            this.records.add();
            this.editMode = true;
            this.formMode = this.formMode !== true ? this.showFormOnCreate === true : this.formMode;
            this.isValid = false;
            this.select(this.records.currentRecord);
            this.dispatch('on-record-add', { viewModel: this });
        };
        DataGrid.prototype.edit = function () {
            this.editMode = true;
            if (this.currentRecord) {
                this.currentRecord.editMode = this.editMode;
            }
            this.dispatch('on-record-edit', { viewModel: this });
        };
        DataGrid.prototype.editForm = function (rec) {
            this.formMode = true;
            this.select(rec);
            this.dispatch('on-form-show', { viewModel: this });
        };
        DataGrid.prototype.endEditForm = function () {
            this.formMode = false;
            this.dispatch('on-form-hide', { viewModel: this });
        };
        DataGrid.prototype.remove = function (item) {
            this.dispatch('on-record-remove', { viewModel: this, record: item });
            this.records.remove(item);
        };
        DataGrid.prototype.save = function () {
            var _this = this;
            var t = this, changes = t.getChanges();
            this.dispatch('on-before-save', { viewModel: this, changes: changes });
            var tasks = [];
            if (changes.added.length > 0) {
                var addedTask = this.api.create({ models: changes.added })
                    .then(function () {
                })
                    .catch(function (e) { return console.log(e); });
                tasks.push(addedTask);
            }
            if (changes.modified.length > 0) {
                var modifiedTask = this.api.update({ models: changes.modified })
                    .then(function () {
                })
                    .catch(function (e) { return console.log(e); });
                tasks.push(modifiedTask);
            }
            if (changes.deleted.length > 0) {
                var deletedTask = this.api.destroy({ models: changes.deleted })
                    .then(function () {
                })
                    .catch(function (e) { return console.log(e); });
                tasks.push(deletedTask);
            }
            var reqs = Promise.all(tasks);
            reqs.then(function () {
                t.records.save(changes);
                if (changes.added.length > 0) {
                    t.total += changes.added.length;
                }
                if (changes.deleted.length > 0 || changes.added.length > 0) {
                    _this.pager.au.controller.viewModel.update();
                }
                if (_this.currentRecord) {
                    _this.currentRecord.editMode = false;
                }
                _this.editMode = false;
                _this.dispatch('on-after-save', { viewModel: _this });
            });
        };
        DataGrid.prototype.cancel = function (showConfirm) {
            var isDirty = this.records.dirty();
            if (showConfirm === true && isDirty === true) {
                if (!confirm('You have unsaved changes. Are you sure you wish to leave?')) {
                    return false;
                }
            }
            var changes = this.getChanges();
            this.dispatch('on-before-cancel', { viewModel: this, changes: changes });
            if (isDirty === true)
                this.records.cancel();
            this.editMode = false;
            if (this.currentRecord) {
                this.currentRecord.editMode = false;
                this.select(this.records.currentRecord);
            }
            this.formMode = false;
            this.isValid = true;
            this.dispatch('on-after-cancel', { viewModel: this });
        };
        DataGrid.prototype.onRecordsChange = function (splice) {
            this.dispatch('on-records-changed', { viewModel: this, changes: splice });
        };
        DataGrid.prototype.getChanges = function () {
            var modified = this.records.filter(function (item) {
                return item.state === record_1.RecordState.modified;
            });
            var added = this.records.filter(function (item) {
                return item.state === record_1.RecordState.added;
            });
            var deleted = this.records.filter(function (item) {
                return item.state === record_1.RecordState.deleted;
            });
            return {
                added: added,
                modified: modified,
                deleted: deleted,
                dirty: added.length > 0 || modified.length > 0 || deleted.length > 0
            };
        };
        DataGrid.prototype.validate = function () {
            this.dispatch('on-before-validate', { viewModel: this });
            this.records.validate();
            this.dispatch('on-after-validate', { viewModel: this });
        };
        DataGrid.prototype.validateCurrentRecord = function () {
            this.records.validateCurrentRecord();
            this.dispatch('on-record-validated', { viewModel: this });
        };
        DataGrid.prototype.setValidationStatus = function (field, isValid) {
            this.records.setValidationStatus(field, isValid);
            this.isValid = this.records.isValid;
        };
        DataGrid.prototype.showChildren = function (rec) {
            this.childMode = true;
            this.select(rec);
        };
        DataGrid.prototype.hideChildren = function () {
            this.childMode = false;
        };
        DataGrid.prototype.parentRecordChanged = function () {
            this.refresh();
        };
        DataGrid.resizeColumn = function (customEvent) {
            var event = customEvent.detail, target = event.target, x = (parseFloat(target.getAttribute('data-x')) || 0), y = (parseFloat(target.getAttribute('data-y')) || 0), data = $(target).data();
            if (event.rect.width < 100)
                return;
            target.style.width = event.rect.width + 'px';
            var selector = ".td-" + data.col;
            $(selector).width(event.rect.width);
            $(selector).css('max-width', event.rect.width + 'px');
            x += event.deltaRect.left;
            y += event.deltaRect.top;
            target.style.webkitTransform = target.style.transform =
                'translate(' + x + 'px,' + y + 'px)';
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        };
        DataGrid.prototype.dispatch = function (name, data) {
            this.element.dispatchEvent(new CustomEvent(name, {
                bubbles: true,
                detail: data
            }));
        };
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Object)
        ], DataGrid.prototype, "options", void 0);
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Object)
        ], DataGrid.prototype, "records", void 0);
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Object)
        ], DataGrid.prototype, "currentRecord", void 0);
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Object)
        ], DataGrid.prototype, "parentRecord", void 0);
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Object)
        ], DataGrid.prototype, "entity", void 0);
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Boolean)
        ], DataGrid.prototype, "editMode", void 0);
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Boolean)
        ], DataGrid.prototype, "formMode", void 0);
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Boolean)
        ], DataGrid.prototype, "showFormOnCreate", void 0);
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Boolean)
        ], DataGrid.prototype, "childMode", void 0);
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Boolean)
        ], DataGrid.prototype, "canLoad", void 0);
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Boolean)
        ], DataGrid.prototype, "showToolbar", void 0);
        DataGrid = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [Element, aurelia_framework_1.ViewCompiler])
        ], DataGrid);
        return DataGrid;
    }());
    exports.DataGrid = DataGrid;
});

//# sourceMappingURL=data-grid.js.map
