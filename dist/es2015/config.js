export let Config = class Config {
    constructor() {
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
    }
};