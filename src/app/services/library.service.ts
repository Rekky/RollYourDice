import { Injectable } from '@angular/core';
import {HttpService} from './http.service';
import {HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {UserInteractor} from '../interactors/UserInteractor';
import {Actor} from '../classes/Actor';

@Injectable({
    providedIn: 'root'
})
export class LibraryService {

    constructor(private httpService: HttpService,
                private userInteractor: UserInteractor) {}


    async createLibraryActor(actor: Actor): Promise<any[]> {
        return new Promise<any>( (resolve, reject) => {
            this.httpService.post(`/library`, {actor: actor}).subscribe(
                (response) => {
                    resolve(response.data);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }


    async getLibrarySection(section): Promise<any[]> {
        const options = {
            headers: new HttpHeaders({
                Authorization: this.userInteractor.getCurrentToken()
            })
        };
        return new Promise<any>( (resolve, reject) => {
            this.httpService.get(`/library/${section}`, options).subscribe(
                (response) => {
                    resolve(response.data);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }


    async deleteLibraryAsset(id: string): Promise<any[]> {
        return new Promise<any>( (resolve, reject) => {
            this.httpService.delete(`/library/assets/${id}`).subscribe(
                (response) => {
                    resolve(response.data);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }
}
