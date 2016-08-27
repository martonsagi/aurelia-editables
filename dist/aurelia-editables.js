define(["require", "exports", './record', './record-manager', './api', './pager', './field', './multi-grid', './data-grid', './data-form', './editors/text-editor', './api', './config', 'aurelia-framework', 'i18next-xhr-backend'], function (require, exports, record_1, record_manager_1, api_1, pager_1, field_1, multi_grid_1, data_grid_1, data_form_1, text_editor_1, api_2, config_1, aurelia_framework_1, Backend) {
    "use strict";
    exports.Record = record_1.Record;
    exports.RecordState = record_1.RecordState;
    exports.RecordManager = record_manager_1.RecordManager;
    exports.Api = api_1.Api;
    exports.Pager = pager_1.Pager;
    exports.Field = field_1.Field;
    exports.MultiGrid = multi_grid_1.MultiGrid;
    exports.DataGrid = data_grid_1.DataGrid;
    exports.DataForm = data_form_1.DataForm;
    exports.TextEditor = text_editor_1.TextEditor;
    function configure(config, callback) {
        if (callback === void 0) { callback = null; }
        var pluginConfig = aurelia_framework_1.Container.instance.get(config_1.Config);
        pluginConfig.api = api_2.Api;
        pluginConfig.editors = {
            text: './editors/text-editor',
            boolean: './editors/boolean-editor',
            dropdown: './editors/dropdown-editor',
        };
        if (callback && callback.length > 0)
            callback(pluginConfig);
        config
            .plugin('aurelia-i18n', function (instance) {
            instance.i18next.use(Backend);
            var setup = {
                backend: {
                    loadPath: pluginConfig.localization.loadPath,
                },
                lng: pluginConfig.localization.defaultLocale,
                defaultNS: 'aurelia-editables',
                ns: 'aurelia-editables',
                attributes: ['t', 'i18n'],
                fallbackLng: 'en',
                debug: false
            };
            if (pluginConfig.onSeti18n)
                pluginConfig.onSeti18n(setup);
            return instance.setup(setup);
        })
            .plugin('aurelia-validation')
            .plugin('aurelia-validatejs')
            .globalResources('./css/aurelia-editables.css!css', './attributes/resizable-field', './editors/boolean-editor', './editors/dropdown-editor', './editors/text-editor', './field', './pager', './data-form', './data-grid', './multi-grid');
    }
    exports.configure = configure;
});

//# sourceMappingURL=aurelia-editables.js.map
