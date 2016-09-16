//#region import

import { bindable, autoinject, bindingMode } from 'aurelia-framework';
import { Record } from '../../record';
import { DataObjectViewModel, DataObjectFormGroupViewModel } from 'aurelia-editables';

//#endregion

@autoinject
export class DataForm {

    //#region Bindables

    @bindable options: DataObjectViewModel;

    @bindable({ defaultBindingMode: bindingMode.twoWay })
    record: Record;

    @bindable onSave: Function;

    @bindable onCancel: Function;

    @bindable integratedMode = false;

    @bindable showToolbar = false;

    //#endregion


    //#region Bindable events

    /*private _events: any = {
        'on-created': null,
        'on-bind': null,
        'on-attached': null,
        'on-record-changed': null,
        'on-before-validate': null,
        'on-after-validate': null
    };*/

    //#endregion


    //#region Properties

    isValid = true;

    validationStatus = {};

    //fields;

    parent: any;

    element: Element;

    groups: Array<any> | null;

    //#endregion

    constructor(element: Element) {
        this.element = element;

        this.dispatch('on-created', { viewModel: this });
    }

    //#region au events

    bind(context) {
        this.parent = context;

        this.dispatch('on-bind', { viewModel: this, context: context});
    }

    attached() {
        let currentGroups = this.options.form && this.options.form.groups && this.options.form.groups.length > 0 ?
            this.options.form.groups : null;

        this.groups = <Array<DataObjectFormGroupViewModel>>[];
        if (currentGroups === null) {
            this.groups.push({ id: 0, name: null, fields: this.options.columns });
            this.options.form.groupCols = 'col-xs-12';
        } else {            
            for (let group of currentGroups) {
                let groupFields = this.options.columns.filter(column => column.groupId === group.id);
                this.groups.push({ id: group.id, name: group.name, fields: groupFields });
            }
        }

        this.dispatch('on-attached', this);
    }

    //#endregion

    //#region Events

    recordChanged(newVal, oldVal) {
        //console.log("form changed", this.validationStatus);
        this.dispatch('on-record-changed', { newValue: newVal, oldValue: oldVal, viewModel: this });
    }
    
    //#endregion

    //#region Save/Cancel events

    callSave(event) {
        this.validate();
        if (this.isValid === true) {
            if (this.parent && this.onSave) {
                this.onSave.call(this.parent, event);
            }
        }
    }
    
    callCancel(event) {
        if (this.parent && this.onCancel) {
            this.onCancel.call(this.parent, event);
        }

        this.validate();
    }

    //#endregion

    //#region Validation

    setValidationStatus(field, isValid) {
        this.validationStatus[field] = isValid;  
        this.validate();
    }

    validate() {
        this.dispatch('on-before-validate', { viewModel: this });

        this.isValid = true;
        let props = Object.getOwnPropertyNames(this.validationStatus);
        for (let field of props) {
            if (this.validationStatus[field] === false) {
                this.isValid = false;
            }
        }

        this.record.isValid = this.isValid;

        this.dispatch('on-after-validate', this);
    }

    //#endregion

    //#region Events

    dispatch(name, data) {
        this.element.dispatchEvent(
            new CustomEvent(name, {
                bubbles: true,
                detail: data
            })
        );
    }

    //#endregion
}
