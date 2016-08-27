export { Record, RecordState } from './record';
export { RecordManager } from './record-manager';
export { Api } from './api';
export { Pager } from './pager';
export { Field } from './field';
export { MultiGrid } from './multi-grid';
export { DataGrid } from './data-grid';
export { DataForm } from './data-form';
export { TextEditor } from './editors/text-editor';

import { Api } from './api';
import { Config } from './config';
import { Container } from 'aurelia-framework';
//import {I18N} from 'aurelia-i18n';
import * as Backend from 'i18next-xhr-backend';
import { i18nSetup } from 'aurelia-editables';

export function configure(config, callback = null) {
    let pluginConfig: Config = Container.instance.get(Config);

    pluginConfig.api = Api;
    pluginConfig.editors = {
        text: './editors/text-editor',
        boolean: './editors/boolean-editor',
        dropdown: './editors/dropdown-editor',
    };

    if (callback && callback.length > 0)
        callback(pluginConfig);

    config
        .plugin('aurelia-i18n', (instance) => {
            // register backend plugin
            instance.i18next.use(Backend);

            // default configuration
            let setup: i18nSetup = {
                backend: {
                    loadPath: pluginConfig.localization.loadPath,
                },
                lng : pluginConfig.localization.defaultLocale,
                defaultNS: 'aurelia-editables',
                ns: 'aurelia-editables',
                attributes : ['t','i18n'],
                fallbackLng : 'en',
                debug : false
            };

            // optional override
            if (pluginConfig.onSeti18n)
                pluginConfig.onSeti18n(setup);

            // make sure to return the promise of the setup method, in order to guarantee proper loading
            return instance.setup(setup);
        })
        .plugin('aurelia-validation')
        .plugin('aurelia-validatejs')
        .globalResources(
            './css/aurelia-editables.css!css',
            './attributes/resizable-field',
            './editors/boolean-editor',
            './editors/dropdown-editor',
            './editors/text-editor',
            './field',
            './pager',
            './data-form',
            './data-grid',
            './multi-grid'
        );
}

  