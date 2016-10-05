import { bindable, observable } from 'aurelia-framework';

export class Pager {

    //#region Bindables

    @bindable count: number;
    @bindable total: number;
    @bindable current: number = 1;
    @bindable size: number = 10;

    //#endregion

    //#region Properties

    parent: any;

    //#endregion

    constructor() {

    }

    //#region au events

    bind(bindingContext) {
        this.parent = bindingContext;
    }

    attached() {

    }

    //#endregion

    //#region Pager functions

    get currentPageInfo() {
        let  curr = this.current * this.size,
            start = curr - this.size + 1,
              end = curr > this.count ? this.count : curr;

        return `${start} - ${end}`;
    }

    setPage(num) {
        if (num === this.current)
            return false;

        if (this.parent.changePage(num, this.size) === true)
            this.current = num;

        return false;
    }

    prev() {
        if (this.current <= 1) {
            return false;
        }

        this.setPage(this.current - 1);

        return false;
    }

    next() {
        if (this.current >= this.total) {
            return false;
        }

        this.setPage(this.current + 1);

        return false;
    }

    update() {
        this.total = Math.ceil(this.count / this.size);
    }

    //#endregion

    //#region Events

    sizeChanged() {
        this.update();
    }

    countChanged() {
        this.update();
    }

    currentChanged() {
        this.update();
    }

    //#endregion
}
