define(['exports', './record', './record-manager', './api', './resources/attributes/resizable-field', './resources/elements/pager', './resources/elements/field', './resources/elements/data-grid-toolbar', './resources/elements/multi-grid', './resources/elements/data-grid', './resources/elements/data-form', './resources/elements/editors/text-editor', './resources/elements/editors/boolean-editor', './resources/elements/editors/dropdown-editor', './config', 'aurelia-framework'], function (exports, _record, _recordManager, _api, _resizableField, _pager, _field, _dataGridToolbar, _multiGrid, _dataGrid, _dataForm, _textEditor, _booleanEditor, _dropdownEditor, _config, _aureliaFramework) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.keys(_record).forEach(function (key) {
        if (key === "default" || key === "__esModule") return;
        Object.defineProperty(exports, key, {
            enumerable: true,
            get: function () {
                return _record[key];
            }
        });
    });
    Object.keys(_recordManager).forEach(function (key) {
        if (key === "default" || key === "__esModule") return;
        Object.defineProperty(exports, key, {
            enumerable: true,
            get: function () {
                return _recordManager[key];
            }
        });
    });
    Object.keys(_api).forEach(function (key) {
        if (key === "default" || key === "__esModule") return;
        Object.defineProperty(exports, key, {
            enumerable: true,
            get: function () {
                return _api[key];
            }
        });
    });
    Object.keys(_resizableField).forEach(function (key) {
        if (key === "default" || key === "__esModule") return;
        Object.defineProperty(exports, key, {
            enumerable: true,
            get: function () {
                return _resizableField[key];
            }
        });
    });
    Object.keys(_pager).forEach(function (key) {
        if (key === "default" || key === "__esModule") return;
        Object.defineProperty(exports, key, {
            enumerable: true,
            get: function () {
                return _pager[key];
            }
        });
    });
    Object.keys(_field).forEach(function (key) {
        if (key === "default" || key === "__esModule") return;
        Object.defineProperty(exports, key, {
            enumerable: true,
            get: function () {
                return _field[key];
            }
        });
    });
    Object.keys(_dataGridToolbar).forEach(function (key) {
        if (key === "default" || key === "__esModule") return;
        Object.defineProperty(exports, key, {
            enumerable: true,
            get: function () {
                return _dataGridToolbar[key];
            }
        });
    });
    Object.keys(_multiGrid).forEach(function (key) {
        if (key === "default" || key === "__esModule") return;
        Object.defineProperty(exports, key, {
            enumerable: true,
            get: function () {
                return _multiGrid[key];
            }
        });
    });
    Object.keys(_dataGrid).forEach(function (key) {
        if (key === "default" || key === "__esModule") return;
        Object.defineProperty(exports, key, {
            enumerable: true,
            get: function () {
                return _dataGrid[key];
            }
        });
    });
    Object.keys(_dataForm).forEach(function (key) {
        if (key === "default" || key === "__esModule") return;
        Object.defineProperty(exports, key, {
            enumerable: true,
            get: function () {
                return _dataForm[key];
            }
        });
    });
    Object.keys(_textEditor).forEach(function (key) {
        if (key === "default" || key === "__esModule") return;
        Object.defineProperty(exports, key, {
            enumerable: true,
            get: function () {
                return _textEditor[key];
            }
        });
    });
    Object.keys(_booleanEditor).forEach(function (key) {
        if (key === "default" || key === "__esModule") return;
        Object.defineProperty(exports, key, {
            enumerable: true,
            get: function () {
                return _booleanEditor[key];
            }
        });
    });
    Object.keys(_dropdownEditor).forEach(function (key) {
        if (key === "default" || key === "__esModule") return;
        Object.defineProperty(exports, key, {
            enumerable: true,
            get: function () {
                return _dropdownEditor[key];
            }
        });
    });
    exports.configure = configure;
    function configure(config) {
        var callback = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

        var pluginConfig = _aureliaFramework.Container.instance.get(_config.Config);
        pluginConfig.api = _api.Api;
        pluginConfig.editors = {
            text: './editors/text-editor',
            boolean: './editors/boolean-editor',
            dropdown: './editors/dropdown-editor'
        };
        if (callback instanceof Function) callback(pluginConfig);
        config.globalResources('./resources/attributes/resizable-field', './resources/elements/editors/boolean-editor', './resources/elements/editors/dropdown-editor', './resources/elements/editors/text-editor', './resources/elements/field', './resources/elements/pager', './resources/elements/data-form', './resources/elements/data-grid-toolbar', './resources/elements/data-grid', './resources/elements/multi-grid');
    }
});