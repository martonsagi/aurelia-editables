//#region import

import { Container, BindingEngine } from 'aurelia-framework';
import { RecordStateOptions } from 'aurelia-editables';

//#endregion

export class Record {
    //#region Properties

    init: boolean;

    state: string;

    isValid: boolean = true;

    editMode: boolean = false;

    //#endregion

    constructor(data: any, state?: string) {
        this.init = false;
        data.state = state || RecordState.unchanged;

        let props: Array<string> = Object.getOwnPropertyNames(data);
        for (let prop of props) {
            this[prop] = data[prop];
        }

        let locator = Container.instance.get(BindingEngine);

        for (let prop of props) {
            switch (prop) {
                default:
                locator
                  .propertyObserver(this, prop)
                  .subscribe(this.onChange.bind(this));
                break;
                case 'state':
                case 'editMode':
                locator
                  .propertyObserver(this, prop)
                  .subscribe(this.onStateChange.bind(this));
                    break;
            }
        }

        this.init = true;
    }

    //#region Events

    onChange() {
        if (this.init === true && this.state === RecordState.unchanged) {
            this.state = RecordState.modified;
        }
    }

    onStateChange() {
    }

    //#endregion
}

export const RecordState: RecordStateOptions = {
    added: 'added',
    unchanged: 'unchanged',
    modified: 'modified',
    deleted: 'deleted'
};