/*
 * Based on: http://davismj.me/blog/aurelia-drag-and-drop/
 */

//#region import

import { autoinject, bindable, bindingMode, ComponentAttached } from 'aurelia-framework';
//import * as interact from 'interact.js';

//#endregion

@autoinject
export class ResizableFieldCustomAttribute implements ComponentAttached {

    //#region Bindables

    @bindable({ defaultBindingMode: bindingMode.oneWay })
    options: any = {
        inertia: true,
        preserveAspectRatio: false,
        edges: { left: false, right: true, bottom: false, top: false }
    };

    //#endregion

    //#region Properties

    element: any;

    //#endregion

    constructor(element: Element) {
        this.element = element;
    }

    //#region au events

    attached() {
        (<any>window).interact(this.element)
            .resizable(Object.assign({}, this.options || {}))
            .on('resizemove', (event) => this.dispatch('resizable-field-onmove', event));
    }

    //#endregion

    //#region Methods

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
