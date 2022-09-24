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

    protected endPointName: string = 'libraries';

    constructor(private httpService: HttpService,
                private userInteractor: UserInteractor) {}

    async createActor(actor: Actor): Promise<any> {
        return new Promise<any>( (resolve, reject) => {
            this.httpService.post(`/${this.endPointName}/`, actor).subscribe(
                (response) => {
                    resolve(response.data);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }

    getMyActors(): Observable<any> {
        return this.httpService.get(`/${this.endPointName}/my-actors`);
    }


    getLibrarySection(section): Observable<any> {
        return this.httpService.get(`/${this.endPointName}/${section}`);
    }


    deleteActor(id: string): Observable<any> {
        console.log('LibraryService_deleteActor');
        return this.httpService.delete(`/${this.endPointName}/${id}`);
    }
}
