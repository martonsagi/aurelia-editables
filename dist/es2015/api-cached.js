import { Container } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';
import * as _ from 'underscore';
export let ApiCached = class ApiCached {
    constructor(baseUrl) {
        this.cachedData = null;
        this.idFieldName = 'Id';
        this.client = Container.instance.get(HttpClient);
        this.baseUrl = baseUrl;
    }
    setData(data, idFieldName) {
        this.cachedData = data;
        if (idFieldName) {
            this.idFieldName = idFieldName;
        }
    }
    read(params) {
        if (this.cachedData === null) {
            return this.client.createRequest(this.baseUrl).asGet().withParams({ 'query': params ? JSON.stringify(params) : {} }).send().then(result => {
                let cachedData = JSON.parse(result.response);
                this.cachedData = cachedData;
                return cachedData;
            });
        } else {
            return new Promise(resolve => {
                if (params) {
                    let filteredData = this.query(params);
                    resolve(filteredData);
                } else {
                    resolve(this.cachedData);
                }
            });
        }
    }
    get(id = null) {
        id = id || null;
        return new Promise(resolve => {
            let record = _.find(this.cachedData.data, item => item[this.idFieldName] === id);
            resolve(record);
        });
    }
    create(data) {
        return new Promise(resolve => {
            for (let row of data.models) {
                this.cachedData.data.push(row);
            }
            resolve();
        });
    }
    update(data) {
        return new Promise(resolve => {
            for (let row of data.models) {
                let existingRow = _.find(this.cachedData.data, item => item[this.idFieldName] === row[this.idFieldName]);
                if (existingRow) {
                    let i = this.cachedData.data.indexOf(existingRow);
                    this.cachedData.data[i] = row;
                }
            }
            resolve();
        });
    }
    destroy(data) {
        return new Promise(resolve => {
            console.log(data);
            for (let row of data.models) {
                let existingRow = _.find(this.cachedData.data, item => item[this.idFieldName] === row[this.idFieldName]);
                console.log(this.idFieldName, row[this.idFieldName], row);
                if (existingRow) {
                    let i = this.cachedData.data.indexOf(existingRow);
                    this.cachedData.data.splice(i, 1);
                }
            }
            resolve();
        });
    }
    query(query) {
        let tempData = this.cachedData.data.slice(0, this.cachedData.data.length - 1);
        if (query.sort) {
            for (let s of query.sort) {
                tempData = this._sort(tempData, s);
            }
        }
        if (query.filters) {
            for (let f of query.filters) {
                tempData = this._filter(tempData, f);
            }
        }
        let result = {
            data: tempData,
            total: tempData.length,
            entity: this.cachedData.entity
        };
        if (query.skip && query.page && query.take) {
            let currIndex = query.page * query.take + 1;
            let endIndex = currIndex + query.take - 1;
            tempData = tempData.slice(currIndex, endIndex);
            result.data = tempData;
            result.total = this.cachedData.total;
        }
        return result;
    }
    _sort(array, sort) {
        let ordered = _.sortBy(array, sort.field);
        if (sort.dir === 'desc') {
            ordered = ordered.reverse();
        }
        return ordered;
    }
    _filter(array, filter) {
        return _.filter(array, item => {
            let result;
            switch (filter.operator) {
                default:
                    result = item[filter.field].indexOf(filter.value) !== -1;
                    break;
            }
            return result;
        });
    }
};