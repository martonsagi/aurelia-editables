import { i18nSetup } from 'aurelia-editables';

export class Config {
    api: any;
    localization: any = {
        defaultLocale: 'en',
        autoLocale: false,
        loadPath: './locales/{{lng}}/{{ns}}.json'
    };
    editors: any = {
        text: './editors/text-editor',
        boolean: './editors/boolean-editor',
        dropdown: './editors/dropdown-editor',
    };
    onSetEditor: any = null;
    onSeti18n: any = null;
}
