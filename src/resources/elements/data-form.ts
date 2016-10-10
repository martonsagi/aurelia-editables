//#region import

import { bindable, autoinject, bindingMode } from 'aurelia-framework';
import { Record } from '../../record';
import { DataObjectViewModel, DataObjectFormGroupViewModel } from 'aurelia-editables';

//#endregion

@autoinject
export class DataForm {

    //#region Bindables

    @bindable({ defaultBindingMode: bindingMode.twoWay })
    record: Record;

    @bindable options: DataObjectViewModel;
    @bindable onSave: Function;
    @bindable onCancel: Function;
    @bindable integratedMode = false;
    @bindable showToolbar = false;
    @bindable editMode: boolean = false;

    //#endregion

    //#region Properties

    parent: any;
    element: Element;
    groups: Array<any> | null;
    validationFields: Array<string>;

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
            if (!this.options.form) {
                this.options.form = {};
            }

            this.options.form.groupCols = 'col-xs-12';
        } else {            
            for (let group of currentGroups) {
                let groupFields: Array<any> = [];

                for (let col of this.options.columns) {
                    if (col.groupId === group.id) {
                        groupFields.push(col);
                    }
                }

                this.groups.push({ id: group.id, name: group.name, fields: groupFields });
            }
        }

        this.dispatch('on-attached', this);
    }

    //#endregion

    //#region Events

    recordChanged(newVal, oldVal) {
        this.validate();
        this.dispatch('on-record-changed', { newValue: newVal, oldValue: oldVal, viewModel: this });
    }
    
    //#endregion

    //#region Save/Cancel events

    callSave(event) {
        this.validate();
        if (this.record.isValid === true) {
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

    get isValid() {
        return this.record.isValid;
    }

    editModeChanged() {
        if (this.editMode === true) {
            setTimeout(() => this.validate(), 100);
        }
    }

    validate() {
        if (this.editMode === true) {
            this.dispatch('on-before-validate', {viewModel: this});

            this.record.validate().then(() =>{
                this.dispatch('on-after-validate', this);
            });
        } else {
            this.dispatch('on-skip-validate', {viewModel: this});
        }
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
