'use strict';

System.register(['aurelia-framework', 'aurelia-http-client'], function (_export, _context) {
    "use strict";

    var Container, HttpClient, Api;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_aureliaFramework) {
            Container = _aureliaFramework.Container;
        }, function (_aureliaHttpClient) {
            HttpClient = _aureliaHttpClient.HttpClient;
        }],
        execute: function () {
            _export('Api', Api = function () {
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
            }());

            _export('Api', Api);
        }
    };
});