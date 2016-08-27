import { bindable, bindingMode } from 'aurelia-framework';
import { Field } from '../field';

export class BooleanEditor {
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    field: Field;

    constructor() {
    }

    activate(model) {
        this.field = model;
    }

}