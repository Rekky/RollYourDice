import { Injectable } from '@angular/core';
import {Game} from '../classes/Game';
import {HttpErrorResponse} from '@angular/common/http';
import {HttpService} from './http.service';

@Injectable({
    providedIn: 'root'
})
export class GameService {

    protected endPointName: string = 'games';

    constructor(private httpService: HttpService) { }

    getGame(gameId: string): Promise<Game> {
        return new Promise<any>( (resolve, reject) => {
            this.httpService.get(`/${this.endPointName}/${gameId}`).subscribe(
                (response) => {
                    resolve(response.data);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }

    getGamesByString(gameId: string): Promise<Game[]> {
        return new Promise<any>( (resolve, reject) => {
            this.httpService.post(`/${this.endPointName}/games`, {searchText: gameId}).subscribe(
                (response) => {
                    resolve(response.data);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }

    createGame(game: Game): Promise<Game> {
        return new Promise<any>( (resolve, reject) => {
            this.httpService.post(`/${this.endPointName}`, game).subscribe(
                (response) => {
                    resolve(response.data);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }

    editGame(game: Game): Promise<any> {
        console.log('editGame', game);
        return new Promise<any>( (resolve, reject) => {
            this.httpService.patch(`/${this.endPointName}/${game.id}`, game).subscribe(
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
            this.httpService.delete(`/${this.endPointName}/${id}`).subscribe(
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
            this.httpService.get(`/${this.endPointName}/search`).subscribe(
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
            this.httpService.post(`/${this.endPointName}/my-games`, {}).subscribe(
                (response) => {
                    resolve(response.data);
                }, (error: HttpErrorResponse) => {
                    reject(error);
                }
            );
        });
    }
}
