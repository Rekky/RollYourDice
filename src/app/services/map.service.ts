import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {Coords} from '../classes/Coords';
import {Game} from '../classes/Game';
import {HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {HttpService} from './http.service';
import {UserInteractor} from '../interactors/UserInteractor';
import {OurKonvaMap} from '../classes/ourKonva/OurKonvaMap';

@Injectable({
    providedIn: 'root'
})
export class MapService {

    constructor(private apiService: ApiService,
                private httpService: HttpService,
                private userInteractor: UserInteractor) { }

    getAllMaps(gameId: string): Promise<OurKonvaMap[]> {
        const options = {
            headers: new HttpHeaders({
                Authorization: this.userInteractor.getCurrentToken()
            })
        };
        return new Promise<any>( (resolve, reject) => {
            this.httpService.get(`/game/${gameId}/maps`, options).subscribe(
                (response) => {
                    resolve(response.data);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
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

    setMapPosition(id: string | number, pos: Coords): void {
        // this.apiService.setMapPosition(id, pos.toJSON());
    }
}
