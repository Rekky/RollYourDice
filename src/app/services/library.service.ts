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

    createActor(actor: Actor): Promise<any> {
        return new Promise<any>( (resolve, reject) => {
            this.httpService.post(`/${this.endPointName}/actor`, actor).subscribe(
                (response) => {
                    resolve(response.data);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }

    getMyActors(): Promise<any> {
        return new Promise<any>( (resolve, reject) => {
            this.httpService.get(`/${this.endPointName}/my-actors`).subscribe(
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
        return this.httpService.get(`/${this.endPointName}/${section}`, options);
    }


    deleteLibraryActor(id: string): Observable<any> {
        return this.httpService.delete(`/${this.endPointName}/assets/${id}`);
    }
}
