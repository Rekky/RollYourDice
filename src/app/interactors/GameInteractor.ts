import {Injectable} from '@angular/core';
import {GameService} from '../services/game.service';
import {Game, GameStatusEnum} from '../classes/Game';
import {UserInteractor} from './UserInteractor';
import {Router} from '@angular/router';
import {BehaviorSubject, from, Observable} from 'rxjs';
import {OurKonvaMapModification} from '../classes/ourKonva/OurKonvaMap';
import {AssetService} from '../services/asset.service';
import {Player} from '../classes/User';

@Injectable({
    providedIn: 'root'
})
export class GameInteractor {
    private currentGame$: BehaviorSubject<Game | null> = new BehaviorSubject<Game>(null);
    public kickedGameId$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

    constructor(private gameService: GameService,
                private imageService: AssetService) {
    }

    setCurrentGame(game: Game): void {
        this.currentGame$.next(game);
    }

    getCurrentGameObs(): Observable<Game> {
        return this.currentGame$.asObservable();
    }

    getCurrentGame(): Game {
        return this.currentGame$.value;
    }

    getGameEditor(id: string): void {
        // return this.gameService.getGameEditor(id);
    }

    async getGame(gameId: string): Promise<Game> {
        return await this.gameService.getGame(gameId);
    }

    getGameObs(gameId: string): Observable<Game> {
        return from(this.gameService.getGame(gameId));
    }

    async createGame(game: Game, asset: any): Promise<Game> {
        try {
            // game.coverImage = await this.imageService.uploadFile(asset);
            return await this.gameService.createGame(game);
        }
        catch (e) {
            return e;
        }
    }

    async removeGame(id: string): Promise<any> {
        return await this.gameService.removeGame(id);
    }

    async editGame(game: Game): Promise<any> {
        return await this.gameService.editGame(game);
    }

    async getAllGames(): Promise<Game[]> {
        return await this.gameService.getAllGames();
    }

    async getMyGames(): Promise<Game[]> {
        return await this.gameService.getMyGames();
    }
}
