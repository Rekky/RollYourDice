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

    constructor(private httpService: HttpService) {}

    public async createActorFromApi(actor: Actor): Promise<any> {
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

    public async getMyActorsFromApi(type: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.httpService.get(`/${this.endPointName}/my-actors`).subscribe(
                (response) => {
                    resolve(response.data);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }

    public deleteActorFromApi(id: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.httpService.delete(`/${this.endPointName}/${id}`).subscribe(
                (response) => {
                    resolve(response.data);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }
}
