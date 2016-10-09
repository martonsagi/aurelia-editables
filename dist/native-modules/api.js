function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { Container } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';
export var Api = function () {
    function Api(baseUrl) {
        _classCallCheck(this, Api);

        this.client = Container.instance.get(HttpClient);
        this.baseUrl = baseUrl;
    }

    Api.prototype.read = function read(params) {
        return this.client.createRequest(this.baseUrl).asGet().withParams({ 'query': params ? JSON.stringify(params) : {} }).send().then(function (result) {
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