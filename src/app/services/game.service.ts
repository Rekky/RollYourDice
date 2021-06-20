import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {Game} from '../classes/Game';
import {HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {User} from '../classes/User';
import {HttpService} from './http.service';
import {UserInteractor} from '../interactors/UserInteractor';

@Injectable({
    providedIn: 'root'
})
export class GameService {

    constructor(private apiService: ApiService,
                private httpService: HttpService,
                private userInteractor: UserInteractor) { }

    getGame(gameId: string): Promise<Game> {
        const options = {
            headers: new HttpHeaders({
                Authorization: this.userInteractor.getToken()
            })
        };
        return new Promise<any>( (resolve, reject) => {
            this.httpService.get(`/game/${gameId}`, options).subscribe(
                (response) => {
                    resolve(response);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }

    createGame(game: Game): Promise<any> {
        const options = {
            headers: new HttpHeaders({
                Authorization: this.userInteractor.getToken()
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

    removeGame(id: string): Promise<any> {
        const options = {
            headers: new HttpHeaders({
                Authorization: this.userInteractor.getToken()
            })
        };
        return new Promise<any>( (resolve, reject) => {
            this.httpService.delete(`/game/${id}`, options).subscribe(
                (response) => {
                    resolve(response);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }

    editGame(game: Game): Promise<any> {
        const options = {
            headers: new HttpHeaders({
                Authorization: this.userInteractor.getToken()
            })
        };
        return new Promise<any>( (resolve, reject) => {
            this.httpService.patch(`/game/${game.id}`, {game}, options).subscribe(
                (response) => {
                    resolve(response);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }

    getAllGames(): Promise<any> {
        const options = {
            headers: new HttpHeaders({
                Authorization: this.userInteractor.getToken()
            })
        };
        return new Promise<any>( (resolve, reject) => {
            this.httpService.get(`/game/search`, options).subscribe(
                (response) => {
                    resolve(response);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }

    getMyGames(): Promise<any> {
        const options = {
            headers: new HttpHeaders({
                Authorization: this.userInteractor.getToken()
            })
        };
        return new Promise<any>( (resolve, reject) => {
            this.httpService.post(`/game/my-games`, {}, options).subscribe(
                (response) => {
                    resolve(response);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }
}
