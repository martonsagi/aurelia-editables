define(["require", "exports"], function (require, exports) {
    "use strict";
    var Config = (function () {
        function Config() {
            this.localization = {
                defaultLocale: 'en',
                autoLocale: false,
                loadPath: './locales/{{lng}}/{{ns}}.json'
            };
            this.editors = {
                text: './editors/text-editor',
                boolean: './editors/boolean-editor',
                dropdown: './editors/dropdown-editor',
            };
            this.onSetEditor = null;
            this.onSeti18n = null;
        }
        return Config;
    }());
    exports.Config = Config;
});

//# sourceMappingURL=config.js.map
