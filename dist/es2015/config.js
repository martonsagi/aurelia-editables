export let Config = class Config {
    constructor() {
        this.editors = {
            text: './editors/text-editor',
            boolean: './editors/boolean-editor',
            dropdown: './editors/dropdown-editor'
        };
        this.onSetEditor = null;
    }
};