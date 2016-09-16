declare module 'aurelia-editables' {

    export class Api {
        constructor(url?: string);
        get(param?: string): Promise<any>;
        read(param?: any): Promise<any>;
        create(data: any): Promise<any>;
        update(data: any): Promise<any>;
        destroy(data: any): Promise<any>;
    }

    export type QueryModel = {
        page?: number | null;
        take?: number | null;
        skip?: number | null;
        filters?: Array<QueryFilterModel>;
        sort?: Array<QuerySortModel>;
    }

    export type QueryFilterModel = {
        field: string;
        value?: any;
        operator: string;
    }

    export type QuerySortModel = {
        field: string;
        dir: string;
    }

    export interface Field {
        options: DataObjectFieldViewModel;
    }

    export interface DataForm {
    }

    export interface DataGrid {
    }

    export interface Pager {
    }

    //#region DataObject
    export type DataObjectViewModel = {
        name?: string | null;
        api?: string | null;
        title?: string | null;
        titleIcon?: string | null;
        refreshColumns?: boolean | null;
        editing?: boolean | null;
        sorting?: boolean | null;
        grouping?: boolean | null;
        filtering?: boolean | null;
        paging?: DataObjectPagingViewModel;
        toolbar?: DataObjectToolbarViewModel;
        form?: DataObjectFormViewModel;
        columns?: Array<DataObjectFieldViewModel>;
        children?: Array<DataObjectViewModel>;
        childOptions?: DataObjectChildrenViewModel;
        events: Array<DataObjectEventViewModel>;
    }

    export type DataObjectEventViewModel = {
        name: string | null;
        event: any;
    }

    export type DataObjectPagingViewModel = {
        paging?: boolean | null;
        size?: number | null;
        current?: number | null;
    }

    export type DataObjectToolbarViewModel = {
        create?: boolean | null;
        update?: boolean | null;
        destroy?: boolean | null;
        download?: DataObjectToolbarDownloadViewModel;
        template?: string;
    }

    export type DataObjectToolbarDownloadViewModel = {
        word?: boolean | null;
        excel?: boolean | null;
        pdf?: boolean | null;
    }

    export type DataObjectFormViewModel = {
        cols?: string | null;
        groupCols?: string | null;
        toolbar?: DataObjectPagingViewModel;
        groups?: Array<DataObjectFormGroupViewModel>;
    }

    export type DataObjectFormGroupViewModel = {
        id?: number | null;
        name?: string | null;
        fields?: Array<DataObjectFieldViewModel> | null;
    }

    export type DataObjectChildrenViewModel = {
        parentFieldName?: string;
        childFieldName?: string;
        titleFieldNames?: Array<string>;
    }

    //#endregion

    //#region DataObject Fields

    export type DataObjectFieldViewModel = {
        name?: string;
        title?: string;
        placeholder?: string;
        type?: string;
        format?: string;
        template?: string;
        hide?: boolean | null;
        hideOnForm?: boolean | null;
        groupId?: number | null;
        filter?: DataObjectFieldFilterViewModel;
        editor?: DataObjectFieldEditorViewModel;
        validation?: any;
        validationMode?: string;
    }

    export type DataObjectFieldFilterViewModel = {
        api?: string;
        values?: Array<any>;
        template?: string;
        filters?: Array<DataObjectFieldFilterListViewModel>;
    }

    export type DataObjectFieldFilterListViewModel = {
        parentFieldName?: string;
        childFieldName?: string;
        value: any;
    }

    export type DataObjectFieldEditorViewModel = {
        api?: string;
        values?: Array<any>;
        type?: string;
    }


    //#endregion

    //#region Records

    export class Record {
        constructor(data: any, state?: string | null);
        isValid: boolean;
        state: string;
    }

    export const RecordState: RecordStateOptions;

    export class RecordManager {
        constructor(template?: any);
        current(item: Record);
        load(data: Array<any>);
        add();
        remove(item: Record);
        save(changesOverride?: any);
        dirty();
        cancel();
        setOriginal(data: Array<any>);
        getOriginal();
        getChanges();
        validate();
        validateCurrentRecord();
        setValidationStatus(field: string, isValid: boolean);
    }

    export type RecordStateOptions = {
        added: string;
        unchanged: string;
        modified: string;
        deleted: string;
    }

    //#endregion

    export type i18nSetup = {
        backend?: BackendOptions;
        lng?: string;
        defaultNS?: string;
        ns?: string;
        attributes?: Array<string>;
        fallbackLng?: string;
        debug?: boolean;
    };

    export type BackendOptions = {
        loadPath?: string | Function,
        addPath?:  string,
        allowMultiLoading?: boolean,
        parse?: () => {},
        crossDomain?: boolean,
        ajax?: () => void
    }

}

//#region i18n

declare module 'i18next-xhr-backend' {

    import { BackendOptions } from 'aurelia-editables';

    interface Interpolator {
        interpolate: () => string
    }
    interface Services {
        interpolator: Interpolator
    }

    /*export default class Backend {
        type: 'backend';
        services: Services;
        options: BackendOptions;
        constructor(services: Services, options?: {});
        init(services: Services, options?: {}): void;
        readMulti(languages: any[], namespaces: any[], callback: () => void): void;
        read(language: {}, namespace: {}, callback: () => void): void;
        loadUrl(url: string, callback: () => void): void;
        create(languages: any[], namespace: string, key: string, fallbackValue: string): void;
    }*/
}

//#endregion
