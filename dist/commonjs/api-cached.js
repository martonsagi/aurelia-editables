'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ApiCached = undefined;

var _aureliaFramework = require('aurelia-framework');

var _aureliaHttpClient = require('aurelia-http-client');

var _underscore = require('underscore');

var _ = _interopRequireWildcard(_underscore);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ApiCached = function () {
    function ApiCached(baseUrl) {
        _classCallCheck(this, ApiCached);

        this.cachedData = null;
        this.idFieldName = 'Id';
        this.client = _aureliaFramework.Container.instance.get(_aureliaHttpClient.HttpClient);
        this.baseUrl = baseUrl;
    }

    ApiCached.prototype.setData = function setData(data, idFieldName) {
        this.cachedData = data;
        if (idFieldName) {
            this.idFieldName = idFieldName;
        }
    };

    ApiCached.prototype.read = function read(params) {
        var _this = this;

        if (this.cachedData === null) {
            return this.client.createRequest(this.baseUrl).asGet().withParams({ 'query': params ? JSON.stringify(params) : {} }).send().then(function (result) {
                var cachedData = JSON.parse(result.response);
                _this.cachedData = cachedData;
                return cachedData;
            });
        } else {
            return new Promise(function (resolve) {
                if (params) {
                    var filteredData = _this.query(params);
                    resolve(filteredData);
                } else {
                    resolve(_this.cachedData);
                }
            });
        }
    };

    ApiCached.prototype.get = function get() {
        var _this2 = this;

        var id = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

        id = id || null;
        return new Promise(function (resolve) {
            var record = _.find(_this2.cachedData.data, function (item) {
                return item[_this2.idFieldName] === id;
            });
            resolve(record);
        });
    };

    ApiCached.prototype.create = function create(data) {
        var _this3 = this;

        return new Promise(function (resolve) {
            for (var _iterator = data.models, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                var _ref;

                if (_isArray) {
                    if (_i >= _iterator.length) break;
                    _ref = _iterator[_i++];
                } else {
                    _i = _iterator.next();
                    if (_i.done) break;
                    _ref = _i.value;
                }

                var row = _ref;

                _this3.cachedData.data.push(row);
            }
            resolve();
        });
    };

    ApiCached.prototype.update = function update(data) {
        var _this4 = this;

        return new Promise(function (resolve) {
            var _loop = function _loop() {
                if (_isArray2) {
                    if (_i2 >= _iterator2.length) return 'break';
                    _ref2 = _iterator2[_i2++];
                } else {
                    _i2 = _iterator2.next();
                    if (_i2.done) return 'break';
                    _ref2 = _i2.value;
                }

                var row = _ref2;

                var existingRow = _.find(_this4.cachedData.data, function (item) {
                    return item[_this4.idFieldName] === row[_this4.idFieldName];
                });
                if (existingRow) {
                    var i = _this4.cachedData.data.indexOf(existingRow);
                    _this4.cachedData.data[i] = row;
                }
            };

            for (var _iterator2 = data.models, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
                var _ref2;

                var _ret = _loop();

                if (_ret === 'break') break;
            }
            resolve();
        });
    };

    ApiCached.prototype.destroy = function destroy(data) {
        var _this5 = this;

        return new Promise(function (resolve) {
            console.log(data);

            var _loop2 = function _loop2() {
                if (_isArray3) {
                    if (_i3 >= _iterator3.length) return 'break';
                    _ref3 = _iterator3[_i3++];
                } else {
                    _i3 = _iterator3.next();
                    if (_i3.done) return 'break';
                    _ref3 = _i3.value;
                }

                var row = _ref3;

                var existingRow = _.find(_this5.cachedData.data, function (item) {
                    return item[_this5.idFieldName] === row[_this5.idFieldName];
                });
                console.log(_this5.idFieldName, row[_this5.idFieldName], row);
                if (existingRow) {
                    var i = _this5.cachedData.data.indexOf(existingRow);
                    _this5.cachedData.data.splice(i, 1);
                }
            };

            for (var _iterator3 = data.models, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
                var _ref3;

                var _ret2 = _loop2();

                if (_ret2 === 'break') break;
            }
            resolve();
        });
    };

    ApiCached.prototype.query = function query(_query) {
        var tempData = this.cachedData.data.slice(0, this.cachedData.data.length - 1);
        if (_query.sort) {
            for (var _iterator4 = _query.sort, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
                var _ref4;

                if (_isArray4) {
                    if (_i4 >= _iterator4.length) break;
                    _ref4 = _iterator4[_i4++];
                } else {
                    _i4 = _iterator4.next();
                    if (_i4.done) break;
                    _ref4 = _i4.value;
                }

                var s = _ref4;

                tempData = this._sort(tempData, s);
            }
        }
        if (_query.filters) {
            for (var _iterator5 = _query.filters, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
                var _ref5;

                if (_isArray5) {
                    if (_i5 >= _iterator5.length) break;
                    _ref5 = _iterator5[_i5++];
                } else {
                    _i5 = _iterator5.next();
                    if (_i5.done) break;
                    _ref5 = _i5.value;
                }

                var f = _ref5;

                tempData = this._filter(tempData, f);
            }
        }
        var result = {
            data: tempData,
            total: tempData.length,
            entity: this.cachedData.entity
        };
        if (_query.skip && _query.page && _query.take) {
            var currIndex = _query.page * _query.take + 1;
            var endIndex = currIndex + _query.take - 1;
            tempData = tempData.slice(currIndex, endIndex);
            result.data = tempData;
            result.total = this.cachedData.total;
        }
        return result;
    };

    ApiCached.prototype._sort = function _sort(array, sort) {
        var ordered = _.sortBy(array, sort.field);
        if (sort.dir === 'desc') {
            ordered = ordered.reverse();
        }
        return ordered;
    };

    ApiCached.prototype._filter = function _filter(array, filter) {
        return _.filter(array, function (item) {
            var result = void 0;
            switch (filter.operator) {
                default:
                    result = item[filter.field].indexOf(filter.value) !== -1;
                    break;
            }
            return result;
        });
    };

    return ApiCached;
}();

exports.ApiCached = ApiCached;