'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _record = require('./record');

Object.keys(_record).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
            return _record[key];
        }
    });
});

var _recordManager = require('./record-manager');

Object.keys(_recordManager).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
            return _recordManager[key];
        }
    });
});

var _api = require('./api');

Object.keys(_api).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
            return _api[key];
        }
    });
});

var _resizableField = require('./resources/attributes/resizable-field');

Object.keys(_resizableField).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
            return _resizableField[key];
        }
    });
});

var _pager = require('./resources/elements/pager');

Object.keys(_pager).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
            return _pager[key];
        }
    });
});

var _field = require('./resources/elements/field');

Object.keys(_field).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
            return _field[key];
        }
    });
});

var _multiGrid = require('./resources/elements/multi-grid');

Object.keys(_multiGrid).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
            return _multiGrid[key];
        }
    });
});

var _dataGrid = require('./resources/elements/data-grid');

Object.keys(_dataGrid).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
            return _dataGrid[key];
        }
    });
});

var _dataForm = require('./resources/elements/data-form');

Object.keys(_dataForm).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
            return _dataForm[key];
        }
    });
});

var _textEditor = require('./resources/elements/editors/text-editor');

Object.keys(_textEditor).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
            return _textEditor[key];
        }
    });
});

var _booleanEditor = require('./resources/elements/editors/boolean-editor');

Object.keys(_booleanEditor).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
            return _booleanEditor[key];
        }
    });
});

var _dropdownEditor = require('./resources/elements/editors/dropdown-editor');

Object.keys(_dropdownEditor).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
            return _dropdownEditor[key];
        }
    });
});
exports.configure = configure;

var _config = require('./config');

var _aureliaFramework = require('aurelia-framework');

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
    config.globalResources('./resources/attributes/resizable-field', './resources/elements/editors/boolean-editor', './resources/elements/editors/dropdown-editor', './resources/elements/editors/text-editor', './resources/elements/field', './resources/elements/pager', './resources/elements/data-form', './resources/elements/data-grid', './resources/elements/multi-grid');
}