define(['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Config = exports.Config = function Config() {
        _classCallCheck(this, Config);

        this.localization = {
            defaultLocale: 'en',
            autoLocale: false,
            loadPath: './locales/{{lng}}/{{ns}}.json'
        };
        this.editors = {
            text: './editors/text-editor',
            boolean: './editors/boolean-editor',
            dropdown: './editors/dropdown-editor'
        };
        this.onSetEditor = null;
        this.onSeti18n = null;
    };
});