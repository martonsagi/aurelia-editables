export * from './record';
export * from './record-manager';
export * from './api';
export * from './resources/attributes/resizable-field';
export * from './resources/elements/pager';
export * from './resources/elements/field';
export * from './resources/elements/data-grid-toolbar';
export * from './resources/elements/multi-grid';
export * from './resources/elements/data-grid';
export * from './resources/elements/data-form';
export * from './resources/elements/editors/text-editor';
export * from './resources/elements/editors/boolean-editor';
export * from './resources/elements/editors/dropdown-editor';

import { Api } from './api';
import { Config } from './config';
import { Container } from 'aurelia-framework';

export function configure(config, callback = null) {
    let pluginConfig: Config = Container.instance.get(Config);

    pluginConfig.api = Api;
    pluginConfig.editors = {
        text: './editors/text-editor',
        boolean: './editors/boolean-editor',
        dropdown: './editors/dropdown-editor',
    };

    if (callback instanceof Function)
        callback(pluginConfig);

    config
        .globalResources(
            './resources/attributes/resizable-field',
            './resources/elements/editors/boolean-editor',
            './resources/elements/editors/dropdown-editor',
            './resources/elements/editors/text-editor',
            './resources/elements/field',
            './resources/elements/pager',
            './resources/elements/data-form',
            './resources/elements/data-grid-toolbar',
            './resources/elements/data-grid',
            './resources/elements/multi-grid'
        );
}

