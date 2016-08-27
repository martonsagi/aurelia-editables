//#region import

import { Container } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';

//#endregion

export class Api {

    //#region Properties
    
    client: HttpClient;
    baseUrl: string;

    //#endregion

    constructor(baseUrl: string) {
        this.client = Container.instance.get(HttpClient);
        this.baseUrl = baseUrl;
    }

    //#region GET operations

    read(params: any): Promise<any> {   
        return this.client.createRequest(this.baseUrl)
                .asGet()
                .withParams({'query': JSON.stringify(params)})
                .send()
                .then(result => JSON.parse(result.response));
    }

    get(id: string = null): Promise<any> {
        id = id || null;
        return this.client.createRequest(`${this.baseUrl}${id !== null ? '/'+id : ''}`)
                .asGet()
                .send()
                .then(result => JSON.parse(result.response));
    }

    //#endregion

    //#region POST operations

    create(data: any): Promise<any> {
        return this.client.createRequest(this.baseUrl)
                .asPost()
                .withContent(data)
                .send()
                .then(result => JSON.parse(result.response));
    }

    //#endregion

    //#region PUT operations

    update(data: any): Promise<any> {
        return this.client.createRequest(this.baseUrl)
                .asPut()
                .withContent(data)
                .send()
                .then(result => JSON.parse(result.response));
    }

    //#endregion

    //#region DELETE operations

    destroy(data: any): Promise<any> {
        return this.client.createRequest(this.baseUrl)
                .asDelete()
                .withContent(data)
                .send()
                .then(result => JSON.parse(result.response));
    }

    //#endregion
}