import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {HttpService} from './http.service';
import {UserInteractor} from '../interactors/UserInteractor';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    API_URL: string = environment.api_url;
    API_SOCKET: string = environment.api_url;

    constructor(private httpService: HttpService) { }

    getGameEditor(id: string): any {
        return null;
    }

    setMapPosition(request: any): any {
        return null;
    }

    async getAllPosts(startPage: number = 0, endPage: number = 30, searchText: string = '', type: string = ''): Promise<any> {
        const options = {
            headers: new HttpHeaders({
                Authorization: ''
            }),
            params: new HttpParams()
                .set('startPage', startPage.toString())
                .set('endPage', endPage.toString())
                .set('searchText', searchText.toString())
                .set('type', type.toString())
        };
        return new Promise<any>( (resolve, reject) => {
            this.httpService.getTest(`https://nuestro-hogar.es:8001/api/public/post`, options).subscribe(
                (response) => {
                    resolve(response);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }
}
