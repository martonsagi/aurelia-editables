import { Container, BindingEngine } from 'aurelia-framework';
export let Record = class Record {
    constructor(data, state) {
        this.isValid = true;
        this.editMode = false;
        this.init = false;
        data.state = state || RecordState.unchanged;
        let props = Object.getOwnPropertyNames(data);
        for (let prop of props) {
            this[prop] = data[prop];
        }
        let locator = Container.instance.get(BindingEngine);
        for (let prop of props) {
            switch (prop) {
                default:
                    locator.propertyObserver(this, prop).subscribe(this.onChange.bind(this));
                    break;
                case 'state':
                case 'editMode':
                    locator.propertyObserver(this, prop).subscribe(this.onStateChange.bind(this));
                    break;
            }
        }
        this.init = true;
    }
    onChange() {
        if (this.init === true && this.state === RecordState.unchanged) {
            this.state = RecordState.modified;
        }
    }
    onStateChange() {}
};
export const RecordState = {
    added: 'added',
    unchanged: 'unchanged',
    modified: 'modified',
    deleted: 'deleted'
};