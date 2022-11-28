import { Injectable } from '@angular/core';
import {HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {HttpService} from './http.service';
import {UserInteractor} from '../interactors/UserInteractor';
import {OurKonvaMap} from '../classes/ourKonva/OurKonvaMap';
import {Observable} from 'rxjs';
import { Actor } from '../classes/Actor';

@Injectable({
    providedIn: 'root'
})
export class MapService {

    protected endPointName: string = 'games';
    protected endPointMap: string = 'maps';

    constructor(private httpService: HttpService,
                private userInteractor: UserInteractor) { }

    getAllMaps(gameId: string): Promise<OurKonvaMap[]> {
        const options = {
            headers: new HttpHeaders({
                Authorization: this.userInteractor.getCurrentToken()
            })
        };
        return new Promise<any>( (resolve, reject) => {
            this.httpService.get(`/${this.endPointName}/${gameId}/maps`, options).subscribe(
                (response) => {
                    resolve(response.data);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }

    getAllMapsObs(gameId: string): Observable<any> {
        const options = {
            headers: new HttpHeaders({
                Authorization: this.userInteractor.getCurrentToken()
            })
        };
        return this.httpService.get(`/${this.endPointName}/${gameId}/maps`, options);
    }

    createNewMap(gameId: string, map: OurKonvaMap): Promise<OurKonvaMap> {
        const body = {
            gameId: gameId,
            map: map
        };

        return new Promise<any>( (resolve, reject) => {
            this.httpService.post(`/map`, body).subscribe(
                (response) => {
                    resolve(response.data);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }

    // public async getActorsOnMap(mapId: string): Promise<Actor[]> {
    //     return new Promise<any>((resolve, reject) => {
    //         this.httpService.get(`/${this.endPointMap}/${mapId}/actors`).subscribe(
    //             (response) => {
    //                 resolve(response.data);
    //             }, (error: HttpErrorResponse) => {
    //                 reject(error);
    //             }
    //         );
    //     });
    // }
}
