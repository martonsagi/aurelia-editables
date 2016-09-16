define(['exports', 'aurelia-framework', 'aurelia-http-client'], function (exports, _aureliaFramework, _aureliaHttpClient) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Api = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Api = exports.Api = function () {
        function Api(baseUrl) {
            _classCallCheck(this, Api);

            this.client = _aureliaFramework.Container.instance.get(_aureliaHttpClient.HttpClient);
            this.baseUrl = baseUrl;
        }

        Api.prototype.read = function read(params) {
            return this.client.createRequest(this.baseUrl).asGet().withParams({ 'query': JSON.stringify(params) }).send().then(function (result) {
                return JSON.parse(result.response);
            });
        };

        Api.prototype.get = function get() {
            var id = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

            id = id || null;
            return this.client.createRequest('' + this.baseUrl + (id !== null ? '/' + id : '')).asGet().send().then(function (result) {
                return JSON.parse(result.response);
            });
        };

        Api.prototype.create = function create(data) {
            return this.client.createRequest(this.baseUrl).asPost().withContent(data).send().then(function (result) {
                return JSON.parse(result.response);
            });
        };

        Api.prototype.update = function update(data) {
            return this.client.createRequest(this.baseUrl).asPut().withContent(data).send().then(function (result) {
                return JSON.parse(result.response);
            });
        };

        Api.prototype.destroy = function destroy(data) {
            return this.client.createRequest(this.baseUrl).asDelete().withContent(data).send().then(function (result) {
                return JSON.parse(result.response);
            });
        };

        return Api;
    }();
});