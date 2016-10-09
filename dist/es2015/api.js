import { Container } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';
export let Api = class Api {
    constructor(baseUrl) {
        this.client = Container.instance.get(HttpClient);
        this.baseUrl = baseUrl;
    }
    read(params) {
        return this.client.createRequest(this.baseUrl).asGet().withParams({ 'query': params ? JSON.stringify(params) : {} }).send().then(result => JSON.parse(result.response));
    }
    get(id = null) {
        id = id || null;
        return this.client.createRequest(`${ this.baseUrl }${ id !== null ? '/' + id : '' }`).asGet().send().then(result => JSON.parse(result.response));
    }
    create(data) {
        return this.client.createRequest(this.baseUrl).asPost().withContent(data).send().then(result => JSON.parse(result.response));
    }
    update(data) {
        return this.client.createRequest(this.baseUrl).asPut().withContent(data).send().then(result => JSON.parse(result.response));
    }
    destroy(data) {
        return this.client.createRequest(this.baseUrl).asDelete().withContent(data).send().then(result => JSON.parse(result.response));
    }
};