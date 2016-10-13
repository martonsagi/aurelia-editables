"use strict";

System.register(["aurelia-framework", "../../config", "../../api", "../../record-manager", "../../deep-observer", "aurelia-binding"], function (_export, _context) {
    "use strict";

    var bindable, autoinject, Container, Config, Api, RecordManager, DeepObserver, observable, _createClass, _typeof, __decorate, __metadata, DataGrid;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_aureliaFramework) {
            bindable = _aureliaFramework.bindable;
            autoinject = _aureliaFramework.autoinject;
            Container = _aureliaFramework.Container;
        }, function (_config) {
            Config = _config.Config;
        }, function (_api) {
            Api = _api.Api;
        }, function (_recordManager) {
            RecordManager = _recordManager.RecordManager;
        }, function (_deepObserver) {
            DeepObserver = _deepObserver.DeepObserver;
        }, function (_aureliaBinding) {
            observable = _aureliaBinding.observable;
        }],
        execute: function () {
            _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

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

            _export("DataGrid", DataGrid = function () {
                function DataGrid(element, deepObserver) {
                    _classCallCheck(this, DataGrid);

                    this.parentRecord = null;
                    this.editMode = false;
                    this.formMode = false;
                    this.showFormOnCreate = false;
                    this.childMode = false;
                    this.canLoad = false;
                    this.showToolbar = true;
                    this.showHeader = true;
                    this.showPager = true;
                    this.filterVisible = false;
                    this.firstInit = true;
                    this.queryModel = { filters: [] };
                    this.columnFilters = null;
                    this.sortSettings = null;
                    this.pageSettings = { current: 1, size: 10 };
                    this.scrollBarWidth = 18;
                    this.element = element;
                    this.deepObserver = deepObserver;
                    this.deepObserverDisposer = this.deepObserver.observe(this, 'options', this.optionsChanged.bind(this));
                    this.pluginConfig = Container.instance.get(Config);
                    this.apiClass = this.pluginConfig.api;
                    this.gridModel = this;
                    this.dispatch('on-created', { viewModel: this });
                }

                DataGrid.prototype.bind = function bind(bindingContext) {
                    this.dispatch('on-bind', { viewModel: this, context: bindingContext });
                    this.recordManager = new RecordManager();
                    this.recordManager.load([{}]);
                };

                DataGrid.prototype.attached = function attached() {
                    this.dispatch('on-attached', { viewModel: this });
                    var canLoad = this.parentRecord === null || this.canLoad === true;
                    this.init(canLoad);
                };

                DataGrid.prototype.detached = function detached() {};

                DataGrid.prototype.unbind = function unbind() {
                    this.editMode = false;
                    this.deepObserverDisposer();
                    this.recordManagerDisposer();
                };

                DataGrid.prototype.recordManagerDisposer = function recordManagerDisposer() {
                    if (this.recordManager.records && this.recordManager.records.length > 0) {
                        this.recordManager.dispose();
                    }
                };

                DataGrid.prototype.init = function init(canLoad) {
                    var _this = this;

                    this.dispatch('on-init', { viewModel: this });
                    this.pageSettings = this.options.paging || this.pageSettings;
                    this.pageSettings.size = this.pageSettings.size || 10;
                    this.api = new this.apiClass(this.options.api);
                    this.loadColumns().then(function () {
                        if (canLoad === true) _this.load();
                    });
                };

                DataGrid.prototype.load = function load() {
                    var _this2 = this;

                    this.dispatch('on-before-load', { viewModel: this });
                    var t = this;
                    t.loading = true;
                    t.setLoader();
                    var childOptions = this.options.childOptions,
                        filterOptions = this.queryModel.filters;
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
                        } else {
                            var checkIndex = filterOptions.indexOf(checkFilter[0]);
                            filterOptions[checkIndex] = parentFilter;
                        }
                    }
                    t.api.read(this.queryModel).then(function (result) {
                        t.entity = result.entity;
                        if (t.columnFilters === null) t.columnFilters = JSON.parse(JSON.stringify(_this2.entity));
                        if (_this2.parentRecord !== null) {
                            t.columnFilters[childOptions.childFieldName] = _this2.parentRecord[childOptions.parentFieldName];
                        }
                        t.total = result.total;
                        t.recordManagerDisposer();
                        t.loadValidationFields();
                        t.recordManager = new RecordManager(t.entity);
                        t.recordManager.queryModel = t.queryModel;
                        t.recordManager.setValidationFields(t.validationFields);
                        return t.recordManager.load(result.data);
                    }).then(function () {
                        t.select(t.recordManager.records[0]);
                        return t.updateColumnWidth(t.firstInit);
                    }).then(function () {
                        t.loading = false;
                        t.firstInit = false;
                        t.dispatch('on-after-load', { viewModel: t });
                    });
                };

                DataGrid.prototype.setLoader = function setLoader() {
                    var table = this.tableBody,
                        tableContainer = this.tableContainer,
                        loader = this.loader;
                    var width = table.offsetWidth > tableContainer.offsetWidth ? tableContainer.offsetWidth : table.offsetWidth,
                        height = table.offsetHeight > tableContainer.offsetHeight ? tableContainer.offsetHeight : table.offsetHeight;
                    loader.style.width = width + 'px';
                    loader.style.height = height + 'px';
                    loader.querySelector('.spinner').style.marginTop = tableContainer.offsetHeight / 2 + 'px';
                };

                DataGrid.prototype.loadColumns = function loadColumns() {
                    var t = this;
                    return new Promise(function (resolve, reject) {
                        var tasks = [],
                            columnTotalWidth = 0,
                            dynamicColumns = [];

                        var _loop = function _loop() {
                            if (_isArray) {
                                if (_i >= _iterator.length) return "break";
                                _ref = _iterator[_i++];
                            } else {
                                _i = _iterator.next();
                                if (_i.done) return "break";
                                _ref = _i.value;
                            }

                            var column = _ref;

                            var editorSettings = column.editor;
                            var callApi = editorSettings && "api" in editorSettings && editorSettings.api !== null && editorSettings.api.length > 0;
                            if (!callApi) {
                                if (!editorSettings) column.editor = { values: [] };
                            } else {
                                var editorApi = new Api(editorSettings.api);
                                var task = editorApi.get().then(function (result) {
                                    editorSettings.values = result;
                                });
                                tasks.push(task);
                            }
                        };

                        for (var _iterator = t.options.columns, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                            var _ref;

                            var _ret = _loop();

                            if (_ret === "break") break;
                        }
                        if (tasks.length > 0) {
                            Promise.all(tasks).then(function () {
                                resolve();
                            }).catch(function (e) {
                                return reject(e);
                            });
                        } else {
                            resolve();
                        }
                    });
                };

                DataGrid.prototype.loadValidationFields = function loadValidationFields() {
                    var fields = this.options.columns.filter(function (col) {
                        return col.validation;
                    }).map(function (col) {
                        return col.name;
                    });
                    this.validationFields = fields;
                };

                DataGrid.prototype.updateColumnWidth = function updateColumnWidth() {
                    var _this3 = this;

                    var resize = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

                    return new Promise(function (resolve, reject) {
                        var columnTotalWidth = 0,
                            dynamicColumns = [],
                            bodyWidth = _this3.tableBodyScroll.getBoundingClientRect().width,
                            rowActions = _this3.tableHeaderScroll.querySelector('.row-actions'),
                            rowActionsWidth = rowActions ? rowActions.getBoundingClientRect().width : 0;
                        for (var _iterator2 = _this3.options.columns, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
                            var _ref2;

                            if (_isArray2) {
                                if (_i2 >= _iterator2.length) break;
                                _ref2 = _iterator2[_i2++];
                            } else {
                                _i2 = _iterator2.next();
                                if (_i2.done) break;
                                _ref2 = _i2.value;
                            }

                            var _column = _ref2;

                            if (_column.width > 0 && resize === false) {
                                columnTotalWidth += _column.width;
                            } else {
                                dynamicColumns.push(_column);
                            }
                        }
                        if (bodyWidth !== null && columnTotalWidth < bodyWidth && dynamicColumns.length > 0) {
                            var divider = dynamicColumns.length,
                                columnsTotalWidth = bodyWidth - columnTotalWidth - rowActionsWidth - _this3.scrollBarWidth,
                                proposedWidth = Math.floor(columnsTotalWidth / divider);
                            proposedWidth = proposedWidth < 150 ? 150 : proposedWidth - 16;
                            for (var _iterator3 = dynamicColumns, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
                                var _ref3;

                                if (_isArray3) {
                                    if (_i3 >= _iterator3.length) break;
                                    _ref3 = _iterator3[_i3++];
                                } else {
                                    _i3 = _iterator3.next();
                                    if (_i3.done) break;
                                    _ref3 = _i3.value;
                                }

                                var dynamicCol = _ref3;

                                dynamicCol.width = proposedWidth;
                            }
                        }
                        resolve();
                    }.bind(this));
                };

                DataGrid.prototype.refresh = function refresh() {
                    var _this4 = this;

                    this.dispatch('on-refresh', { viewModel: this });
                    if (this.cancel(true) === false) {
                        return false;
                    }
                    var refreshColumns = this.options.refreshColumns || false;
                    if (refreshColumns) {
                        this.loadColumns().then(function () {
                            _this4.load();
                        });
                    } else {
                        this.load();
                    }
                };

                DataGrid.prototype.setFilter = function setFilter(column) {
                    this.dispatch('on-filter', { viewModel: this });
                    var found = false,
                        filters = this.queryModel.filters,
                        operator = "contains",
                        filterValue = this.columnFilters[column];
                    var columnSettings = this.options.columns.filter(function (col) {
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
                    for (var _iterator4 = filters, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
                        var _ref4;

                        if (_isArray4) {
                            if (_i4 >= _iterator4.length) break;
                            _ref4 = _iterator4[_i4++];
                        } else {
                            _i4 = _iterator4.next();
                            if (_i4.done) break;
                            _ref4 = _i4.value;
                        }

                        var filter = _ref4;

                        if (filter.field === column) {
                            if (filterValue !== null && filterValue.length > 0) {
                                filter = { field: column, value: filterValue, operator: operator };
                            } else {
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

                DataGrid.prototype.toggleFilter = function toggleFilter() {
                    this.filterVisible = !this.filterVisible;
                };

                DataGrid.prototype.sort = function sort(fieldName) {
                    this.dispatch('on-sort', { viewModel: this });
                    var canSort = this.options.sorting || false;
                    if (canSort === false) return;
                    if (this.sortSettings !== null && this.sortSettings.field === fieldName && this.sortSettings.dir === 'desc') {
                        this.sortSettings = null;
                        this.queryModel.sort = null;
                    } else {
                        var order = this.sortSettings === null || this.sortSettings.field !== fieldName ? 'asc' : this.sortSettings.dir === 'asc' ? 'desc' : 'asc';
                        this.sortSettings = { field: fieldName, dir: order };
                        this.queryModel.sort = [{ field: fieldName, dir: order }];
                    }
                    this.refresh();
                };

                DataGrid.prototype.select = function select(rec) {
                    if (this.recordManager.currentRecord) this.recordManager.currentRecord.editMode = false;
                    if (rec) {
                        rec.editMode = this.editMode || this.formMode;
                    }
                    this.recordManager.current(rec);
                    this.dispatch('on-select', { viewModel: this });
                    return true;
                };

                DataGrid.prototype.changePage = function changePage(newPage, newSize) {
                    if (this.cancel(true) === false) {
                        return false;
                    }
                    this.pageSettings.current = newPage;
                    this.pageSettings.size = newSize;
                    this.dispatch('on-page-changed', { newPage: newPage, newSize: newSize, viewModel: this });
                    this.load();
                    return true;
                };

                DataGrid.prototype.add = function add() {
                    var _this5 = this;

                    this.editMode = true;
                    this.formMode = this.formMode !== true ? this.showFormOnCreate === true : this.formMode;
                    this.tableBodyScroll.scrollTop = 0;
                    this.recordManager.add().then(function () {
                        _this5.select(_this5.recordManager.currentRecord);
                        _this5.dispatch('on-record-add', { viewModel: _this5 });
                    });
                };

                DataGrid.prototype.edit = function edit() {
                    var _this6 = this;

                    this.editMode = !this.editMode;
                    this.recordManager.edit(this.editMode).then(function () {
                        if (_this6.editMode === true) {
                            _this6.dispatch('on-record-edit-begin', { viewModel: _this6 });
                        } else {
                            _this6.dispatch('on-record-edit-end', { viewModel: _this6 });
                        }
                    });
                };

                DataGrid.prototype.editForm = function editForm(rec) {
                    this.formMode = true;
                    this.select(rec);
                    this.dispatch('on-record-edit-begin', { viewModel: this });
                };

                DataGrid.prototype.endEditForm = function endEditForm() {
                    this.formMode = false;
                    this.recordManager.currentRecord.editMode = this.editMode || this.formMode;
                    this.dispatch('on-record-edit-end', { viewModel: this });
                };

                DataGrid.prototype.remove = function remove(item) {
                    this.dispatch('on-record-remove', { viewModel: this, record: item });
                    this.recordManager.remove(item);
                };

                DataGrid.prototype.save = function save() {
                    var _this7 = this;

                    var t = this,
                        changes = this.recordManager.getChanges();
                    this.dispatch('on-before-save', { viewModel: this, changes: changes });
                    var tasks = [];
                    if (changes.added.length > 0) {
                        var addedTask = this.api.create({ models: changes.added }).then(function () {}).catch(function (e) {
                            return console.log(e);
                        });
                        tasks.push(addedTask);
                    }
                    if (changes.modified.length > 0) {
                        var modifiedTask = this.api.update({ models: changes.modified }).then(function () {}).catch(function (e) {
                            return console.log(e);
                        });
                        tasks.push(modifiedTask);
                    }
                    if (changes.deleted.length > 0) {
                        var deletedTask = this.api.destroy({ models: changes.deleted }).then(function () {}).catch(function (e) {
                            return console.log(e);
                        });
                        tasks.push(deletedTask);
                    }
                    var reqs = Promise.all(tasks);
                    reqs.then(function () {
                        t.recordManager.save(changes);
                        if (changes.added.length > 0) {
                            t.total += changes.added.length;
                        }
                        if (changes.deleted.length > 0 || changes.added.length > 0) {
                            _this7.pager.au.controller.viewModel.update();
                        }
                        if (_this7.recordManager.currentRecord) {
                            _this7.recordManager.currentRecord.editMode = false;
                        }
                        _this7.editMode = false;
                        _this7.dispatch('on-after-save', { viewModel: _this7 });
                    });
                };

                DataGrid.prototype.cancel = function cancel(showConfirm) {
                    var isDirty = this.recordManager.isDirty;
                    if (showConfirm === true && isDirty === true) {
                        if (!confirm('You have unsaved changes. Are you sure you wish to leave?')) {
                            return false;
                        }
                    }
                    this.dispatch('on-before-cancel', { viewModel: this });
                    this.editMode = false;
                    this.formMode = false;
                    if (this.recordManager.currentRecord) {
                        this.recordManager.currentRecord.editMode = false;
                        this.select(this.recordManager.currentRecord);
                    }
                    if (isDirty === true) this.recordManager.cancel();
                    this.dispatch('on-after-cancel', { viewModel: this });
                };

                DataGrid.prototype.onRecordsChange = function onRecordsChange(splice) {
                    this.dispatch('on-records-changed', { viewModel: this, changes: splice });
                };

                DataGrid.prototype.validate = function validate() {
                    this.dispatch('on-before-validate', { viewModel: this });
                    this.recordManager.validate();
                    this.dispatch('on-after-validate', { viewModel: this });
                };

                DataGrid.prototype.showChildren = function showChildren(rec) {
                    this.childMode = true;
                    this.select(rec);
                };

                DataGrid.prototype.hideChildren = function hideChildren() {
                    this.childMode = false;
                };

                DataGrid.prototype.parentRecordChanged = function parentRecordChanged() {
                    this.refresh();
                };

                DataGrid.prototype.resizeColumn = function resizeColumn(customEvent, column) {
                    var event = customEvent.detail,
                        target = event.target,
                        data = target.dataset;
                    if (column.resizing === false) return;
                    if (event.rect.width < 100) return;
                    column.width = event.rect.width - 16;
                };

                DataGrid.prototype.optionsChanged = function optionsChanged(newValue, oldValue, property) {
                    this.dispatch('on-options-changed', {
                        viewModel: this,
                        newValue: newValue,
                        oldValue: oldValue,
                        property: property
                    });
                };

                DataGrid.prototype.editModeChanged = function editModeChanged() {
                    var _this8 = this;

                    if (this.editMode === true && this.formMode !== true) {
                        setTimeout(function () {
                            return _this8.validate();
                        }, 100);
                    }
                };

                DataGrid.prototype.onScroll = function onScroll(event) {
                    this.tableHeaderScroll.scrollLeft = event.target.scrollLeft;
                };

                DataGrid.prototype.dispatch = function dispatch(name, data) {
                    this.element.dispatchEvent(new CustomEvent(name, {
                        bubbles: true,
                        detail: data
                    }));
                };

                _createClass(DataGrid, [{
                    key: "toolbarTemplateOption",
                    get: function get() {
                        return this.options.toolbarTemplate || this.toolbarTemplate || './data-grid-toolbar';
                    }
                }]);

                return DataGrid;
            }());

            _export("DataGrid", DataGrid);

            __decorate([bindable, __metadata('design:type', Object)], DataGrid.prototype, "options", void 0);
            __decorate([bindable, __metadata('design:type', Object)], DataGrid.prototype, "parentRecord", void 0);
            __decorate([bindable, __metadata('design:type', Object)], DataGrid.prototype, "entity", void 0);
            __decorate([bindable, __metadata('design:type', Boolean)], DataGrid.prototype, "editMode", void 0);
            __decorate([bindable, __metadata('design:type', Boolean)], DataGrid.prototype, "formMode", void 0);
            __decorate([bindable, __metadata('design:type', Boolean)], DataGrid.prototype, "showFormOnCreate", void 0);
            __decorate([bindable, __metadata('design:type', Boolean)], DataGrid.prototype, "childMode", void 0);
            __decorate([bindable, __metadata('design:type', Boolean)], DataGrid.prototype, "canLoad", void 0);
            __decorate([bindable, __metadata('design:type', Boolean)], DataGrid.prototype, "showToolbar", void 0);
            __decorate([bindable, __metadata('design:type', Boolean)], DataGrid.prototype, "showHeader", void 0);
            __decorate([bindable, __metadata('design:type', Boolean)], DataGrid.prototype, "showPager", void 0);
            __decorate([bindable, __metadata('design:type', Boolean)], DataGrid.prototype, "filterVisible", void 0);
            __decorate([bindable, __metadata('design:type', String)], DataGrid.prototype, "toolbarTemplate", void 0);
            __decorate([bindable, __metadata('design:type', Object)], DataGrid.prototype, "gridModel", void 0);
            __decorate([observable(), __metadata('design:type', Boolean)], DataGrid.prototype, "loading", void 0);
            _export("DataGrid", DataGrid = __decorate([autoinject, __metadata('design:paramtypes', [Element, DeepObserver])], DataGrid));
        }
    };
});