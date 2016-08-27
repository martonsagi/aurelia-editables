import { bindable, bindingMode } from 'aurelia-framework';
import { Field } from '../field';

export class TextEditor {
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    field: Field;

    constructor() {
    }

    activate(model) {
        this.field = model;
    }

}