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
        return new Promise<any>( (resolve, reject) => {
            this.httpService.get(`/game/${gameId}`).subscribe(
                (response) => {
                    resolve(response);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }

    createGame(game: Game, formData: any): Promise<Game> {
        return new Promise<any>( (resolve, reject) => {
            console.log('post entras');
            this.httpService.post(`/game`, formData).subscribe(
                (response) => {
                    resolve(response);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }

    removeGame(id: string): Promise<any> {
        return new Promise<any>( (resolve, reject) => {
            this.httpService.delete(`/game/${id}`).subscribe(
                (response) => {
                    resolve(response);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }

    editGame(game: Game, formData: any): Promise<any> {
        return new Promise<any>( (resolve, reject) => {
            this.httpService.patch(`/game/${game.id}`, formData).subscribe(
                (response) => {
                    resolve(response);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }

    getAllGames(): Promise<any> {
        return new Promise<any>( (resolve, reject) => {
            this.httpService.get(`/game/search`).subscribe(
                (response) => {
                    resolve(response);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }

    getMyGames(): Promise<any> {
        return new Promise<any>( (resolve, reject) => {
            this.httpService.post(`/game/my-games`, {}).subscribe(
                (response) => {
                    resolve(response);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }
}
