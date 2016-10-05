//#region import

import { bindable } from 'aurelia-framework';
import { DataObjectViewModel } from 'aurelia-editables';

//#endregion

export class MultiGrid {

    //#region Bindables
    @bindable()
    gridOptions: Array<DataObjectViewModel>;

    //#endregion

    constructor() {
    }
}
