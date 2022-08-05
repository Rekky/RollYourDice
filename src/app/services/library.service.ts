import { Injectable } from '@angular/core';
import {HttpService} from './http.service';
import {HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {UserInteractor} from '../interactors/UserInteractor';
import {Actor} from '../classes/Actor';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LibraryService {

    constructor(private httpService: HttpService,
                private userInteractor: UserInteractor) {}


    createLibraryActor(actor: Actor): Observable<any> {
        return this.httpService.post(`/library`, {actor: actor});
    }


    getLibrarySection(section): Observable<any> {
        const options = {
            headers: new HttpHeaders({
                Authorization: this.userInteractor.getCurrentToken()
            })
        };
        return this.httpService.get(`/library/${section}`, options);
    }


    deleteLibraryAsset(id: string): Observable<any> {
        return this.httpService.delete(`/library/assets/${id}`);
    }
}
