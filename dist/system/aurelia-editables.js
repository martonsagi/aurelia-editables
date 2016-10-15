'use strict';

System.register(['./record', './record-manager', './api', './api-cached', './resources/attributes/resizable-field', './resources/elements/pager', './resources/elements/field', './resources/elements/data-grid-toolbar', './resources/elements/multi-grid', './resources/elements/data-grid', './resources/elements/data-form', './resources/elements/editors/text-editor', './resources/elements/editors/boolean-editor', './resources/elements/editors/dropdown-editor', './config', 'aurelia-framework'], function (_export, _context) {
    "use strict";

    var Api, Config, Container;
    function configure(config) {
        var callback = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

        var pluginConfig = Container.instance.get(Config);
        pluginConfig.api = Api;
        pluginConfig.editors = {
            text: './editors/text-editor',
            boolean: './editors/boolean-editor',
            dropdown: './editors/dropdown-editor'
        };
        if (callback instanceof Function) callback(pluginConfig);
        config.globalResources('./resources/attributes/resizable-field', './resources/elements/editors/boolean-editor', './resources/elements/editors/dropdown-editor', './resources/elements/editors/text-editor', './resources/elements/field', './resources/elements/pager', './resources/elements/data-form', './resources/elements/data-grid-toolbar', './resources/elements/data-grid', './resources/elements/multi-grid');
    }

    _export('configure', configure);

    return {
        setters: [function (_record) {
            var _exportObj = {};

            for (var _key in _record) {
                if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _record[_key];
            }

            _export(_exportObj);
        }, function (_recordManager) {
            var _exportObj2 = {};

            for (var _key2 in _recordManager) {
                if (_key2 !== "default" && _key2 !== "__esModule") _exportObj2[_key2] = _recordManager[_key2];
            }

            _export(_exportObj2);
        }, function (_api) {
            Api = _api.Api;
            var _exportObj3 = {};

            for (var _key3 in _api) {
                if (_key3 !== "default" && _key3 !== "__esModule") _exportObj3[_key3] = _api[_key3];
            }

            _export(_exportObj3);
        }, function (_apiCached) {
            var _exportObj4 = {};

            for (var _key4 in _apiCached) {
                if (_key4 !== "default" && _key4 !== "__esModule") _exportObj4[_key4] = _apiCached[_key4];
            }

            _export(_exportObj4);
        }, function (_resourcesAttributesResizableField) {
            var _exportObj5 = {};

            for (var _key5 in _resourcesAttributesResizableField) {
                if (_key5 !== "default" && _key5 !== "__esModule") _exportObj5[_key5] = _resourcesAttributesResizableField[_key5];
            }

            _export(_exportObj5);
        }, function (_resourcesElementsPager) {
            var _exportObj6 = {};

            for (var _key6 in _resourcesElementsPager) {
                if (_key6 !== "default" && _key6 !== "__esModule") _exportObj6[_key6] = _resourcesElementsPager[_key6];
            }

            _export(_exportObj6);
        }, function (_resourcesElementsField) {
            var _exportObj7 = {};

            for (var _key7 in _resourcesElementsField) {
                if (_key7 !== "default" && _key7 !== "__esModule") _exportObj7[_key7] = _resourcesElementsField[_key7];
            }

            _export(_exportObj7);
        }, function (_resourcesElementsDataGridToolbar) {
            var _exportObj8 = {};

            for (var _key8 in _resourcesElementsDataGridToolbar) {
                if (_key8 !== "default" && _key8 !== "__esModule") _exportObj8[_key8] = _resourcesElementsDataGridToolbar[_key8];
            }

            _export(_exportObj8);
        }, function (_resourcesElementsMultiGrid) {
            var _exportObj9 = {};

            for (var _key9 in _resourcesElementsMultiGrid) {
                if (_key9 !== "default" && _key9 !== "__esModule") _exportObj9[_key9] = _resourcesElementsMultiGrid[_key9];
            }

            _export(_exportObj9);
        }, function (_resourcesElementsDataGrid) {
            var _exportObj10 = {};

            for (var _key10 in _resourcesElementsDataGrid) {
                if (_key10 !== "default" && _key10 !== "__esModule") _exportObj10[_key10] = _resourcesElementsDataGrid[_key10];
            }

            _export(_exportObj10);
        }, function (_resourcesElementsDataForm) {
            var _exportObj11 = {};

            for (var _key11 in _resourcesElementsDataForm) {
                if (_key11 !== "default" && _key11 !== "__esModule") _exportObj11[_key11] = _resourcesElementsDataForm[_key11];
            }

            _export(_exportObj11);
        }, function (_resourcesElementsEditorsTextEditor) {
            var _exportObj12 = {};

            for (var _key12 in _resourcesElementsEditorsTextEditor) {
                if (_key12 !== "default" && _key12 !== "__esModule") _exportObj12[_key12] = _resourcesElementsEditorsTextEditor[_key12];
            }

            _export(_exportObj12);
        }, function (_resourcesElementsEditorsBooleanEditor) {
            var _exportObj13 = {};

            for (var _key13 in _resourcesElementsEditorsBooleanEditor) {
                if (_key13 !== "default" && _key13 !== "__esModule") _exportObj13[_key13] = _resourcesElementsEditorsBooleanEditor[_key13];
            }

            _export(_exportObj13);
        }, function (_resourcesElementsEditorsDropdownEditor) {
            var _exportObj14 = {};

            for (var _key14 in _resourcesElementsEditorsDropdownEditor) {
                if (_key14 !== "default" && _key14 !== "__esModule") _exportObj14[_key14] = _resourcesElementsEditorsDropdownEditor[_key14];
            }

            _export(_exportObj14);
        }, function (_config) {
            Config = _config.Config;
        }, function (_aureliaFramework) {
            Container = _aureliaFramework.Container;
        }],
        execute: function () {}
    };
});