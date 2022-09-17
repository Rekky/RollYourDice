import { Injectable } from '@angular/core';
import {HttpService} from './http.service';
import {HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {UserInteractor} from '../interactors/UserInteractor';
import {Observable} from 'rxjs';
import {OurKonvaMap} from '../classes/ourKonva/OurKonvaMap';
import {Actor} from '../classes/Actor';

@Injectable({
    providedIn: 'root'
})
export class LibraryService {

    constructor(private httpService: HttpService,
                private userInteractor: UserInteractor) {}

    createActor(actor: Actor): Promise<any> {
        const body = {
            actor: actor
        };
        return new Promise<any>( (resolve, reject) => {
            this.httpService.post(`/library/actor`, body).subscribe(
                (response) => {
                    resolve(response.data);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }


    getLibrarySection(section): Observable<any> {
        const options = {
            headers: new HttpHeaders({
                Authorization: this.userInteractor.getCurrentToken()
            })
        };
        return this.httpService.get(`/library/${section}`, options);
    }


    deleteLibraryActor(id: string): Observable<any> {
        return this.httpService.delete(`/library/assets/${id}`);
    }
}
