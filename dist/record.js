define(["require", "exports", 'aurelia-framework'], function (require, exports, aurelia_framework_1) {
    "use strict";
    var Record = (function () {
        function Record(data, state) {
            this.isValid = true;
            this.editMode = false;
            this.init = false;
            data.state = state || exports.RecordState.unchanged;
            var props = Object.getOwnPropertyNames(data);
            for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
                var prop = props_1[_i];
                this[prop] = data[prop];
            }
            var locator = aurelia_framework_1.Container.instance.get(aurelia_framework_1.BindingEngine);
            for (var _a = 0, props_2 = props; _a < props_2.length; _a++) {
                var prop = props_2[_a];
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
        Record.prototype.onChange = function () {
            if (this.init === true && this.state === exports.RecordState.unchanged) {
                this.state = exports.RecordState.modified;
            }
        };
        Record.prototype.onStateChange = function () {
        };
        return Record;
    }());
    exports.Record = Record;
    exports.RecordState = {
        added: 'added',
        unchanged: 'unchanged',
        modified: 'modified',
        deleted: 'deleted'
    };
});

//# sourceMappingURL=record.js.map
