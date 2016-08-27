define(["require", "exports", 'aurelia-framework', 'aurelia-http-client'], function (require, exports, aurelia_framework_1, aurelia_http_client_1) {
    "use strict";
    var Api = (function () {
        function Api(baseUrl) {
            this.client = aurelia_framework_1.Container.instance.get(aurelia_http_client_1.HttpClient);
            this.baseUrl = baseUrl;
        }
        Api.prototype.read = function (params) {
            return this.client.createRequest(this.baseUrl)
                .asGet()
                .withParams({ 'query': JSON.stringify(params) })
                .send()
                .then(function (result) { return JSON.parse(result.response); });
        };
        Api.prototype.get = function (id) {
            if (id === void 0) { id = null; }
            id = id || null;
            return this.client.createRequest("" + this.baseUrl + (id !== null ? '/' + id : ''))
                .asGet()
                .send()
                .then(function (result) { return JSON.parse(result.response); });
        };
        Api.prototype.create = function (data) {
            return this.client.createRequest(this.baseUrl)
                .asPost()
                .withContent(data)
                .send()
                .then(function (result) { return JSON.parse(result.response); });
        };
        Api.prototype.update = function (data) {
            return this.client.createRequest(this.baseUrl)
                .asPut()
                .withContent(data)
                .send()
                .then(function (result) { return JSON.parse(result.response); });
        };
        Api.prototype.destroy = function (data) {
            return this.client.createRequest(this.baseUrl)
                .asDelete()
                .withContent(data)
                .send()
                .then(function (result) { return JSON.parse(result.response); });
        };
        return Api;
    }());
    exports.Api = Api;
});

//# sourceMappingURL=api.js.map
