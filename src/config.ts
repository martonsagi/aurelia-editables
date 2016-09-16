
export class Config {
    api: any;
    apiBaseUrl: string;
    editors: any = {
        text: './editors/text-editor',
        boolean: './editors/boolean-editor',
        dropdown: './editors/dropdown-editor',
    };
    onSetEditor: any = null;
}
