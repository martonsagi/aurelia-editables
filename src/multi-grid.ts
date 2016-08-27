//#region import

import { transient, bindable } from 'aurelia-framework';
import { DataObjectViewModel } from 'aurelia-editables';

//#endregion

@transient()
export class MultiGrid {

    //#region Bindables
    @bindable()
    gridOptions: Array<DataObjectViewModel>;

    //#endregion

    constructor() {
    }
}