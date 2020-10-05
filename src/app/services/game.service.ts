import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {Game} from '../classes/Game';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {User} from '../classes/User';
import {HttpService} from './http.service';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GameService {

    constructor(private apiService: ApiService, private http: HttpClient, private httpService: HttpService) { }

    getGameEditor(id: string): void {
        // console.log(this.apiService.getGameEditor(id));
        // const game = new Game(this.apiService.getGameEditor(id));
        // return game;
        // return Game.fromJSON(this.apiService.getGameEditor(id));
    }

    createGame(game: Game): Promise<any> {
        const options = {
            headers: new HttpHeaders({
                // Authorization: this.sessionService.getSessionToken()
                Authorization: ''
            })
        };

        return new Promise<any>( (resolve, reject) => {
            this.httpService.post(`/game`, game, options).subscribe(
                (response) => {
                    resolve(response);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }

    getAllGames(): Promise<any> {
        // const body = {};
        // return this.httpService.get(`/game/all`, body).toPromise();
        const options = {};
        return new Promise<any>( (resolve, reject) => {
            this.httpService.get(`/game/my-games`, options).subscribe(
                (response) => {
                    resolve(response);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }

    getMyGames(user: User): Promise<any> {
        const params = new HttpParams().set('token', user.id.toString());

        const options = {
            headers: new HttpHeaders({
                // Authorization: this.sessionService.getSessionToken()
                Authorization: ''
            })
        };

        return new Promise<any>( (resolve, reject) => {
            this.httpService.get(`/game/my-games`, options).subscribe(
                (response) => {
                    resolve(response);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }
}
