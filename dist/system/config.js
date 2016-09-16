'use strict';

System.register([], function (_export, _context) {
    "use strict";

    var Config;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [],
        execute: function () {
            _export('Config', Config = function Config() {
                _classCallCheck(this, Config);

                this.editors = {
                    text: './editors/text-editor',
                    boolean: './editors/boolean-editor',
                    dropdown: './editors/dropdown-editor'
                };
                this.onSetEditor = null;
            });

            _export('Config', Config);
        }
    };
});