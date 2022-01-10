import {Injectable} from '@angular/core';
import {GameService} from '../services/game.service';
import {Game, GameStatus} from '../classes/Game';
import {UserInteractor} from './UserInteractor';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {OurKonvaMapModification} from '../classes/ourKonva/OurKonvaMap';

@Injectable({
    providedIn: 'root'
})
export class GameInteractor {
    private currentGame: BehaviorSubject<Game | null> = new BehaviorSubject<Game>(null);
    private gameStatusModification: BehaviorSubject<{gameId: string, status: GameStatus}> = new BehaviorSubject<{gameId: string, status: GameStatus}>(null);

    constructor(private gameService: GameService) {
    }

    setCurrentGame(game: Game): void {
        this.currentGame.next(game);
    }

    getCurrentGameObs(): Observable<Game> {
        return this.currentGame.asObservable();
    }

    setGameStatus(data: {gameId: string, status: GameStatus}): void {
        this.gameStatusModification.next(data);
    }

    getGameStatusObs(): Observable<{gameId: string, status: GameStatus}> {
        return this.gameStatusModification.asObservable();
    }

    getGameEditor(id: string): void {
        // return this.gameService.getGameEditor(id);
    }

    async getGame(gameId: string): Promise<Game> {
        return await this.gameService.getGame(gameId);
    }

    async createGame(game: Game, formData: any): Promise<Game> {
        return await this.gameService.createGame(game, formData);
    }

    async removeGame(id: string): Promise<any> {
        return await this.gameService.removeGame(id);
    }

    async editGame(game: Game, formData: any): Promise<any> {
        return await this.gameService.editGame(game, formData);
    }

    async getAllGames(): Promise<Game[]> {
        return await this.gameService.getAllGames();
    }

    async getMyGames(): Promise<Game[]> {
        return await this.gameService.getMyGames();
    }

    updateGameStatus(data: {gameId: string, status: GameStatus}): void {
        this.setGameStatus(data);
    }
}
