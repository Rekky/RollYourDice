import {Injectable} from '@angular/core';
import {GameService} from '../services/game.service';
import {Game} from '../classes/Game';
import {UserInteractor} from './UserInteractor';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GameInteractor {
    private currentGame: BehaviorSubject<Game | null> = new BehaviorSubject<Game>(null);

    constructor(private gameService: GameService,
                private userInteractor: UserInteractor,
                private router: Router) {

    }

    setCurrentGame(game: Game): void {
        this.currentGame.next(game);
    }

    getCurrentGame(): Observable<Game> {
        return this.currentGame.asObservable();
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

    goToTheGame(game): void {
        const currentUser = this.userInteractor.getCurrentUser();
        if (currentUser) {
            this.router.navigate(['/game-editor/', game.id]);
        } else {
            this.router.navigate(['/launcher']);
        }
    }
}
