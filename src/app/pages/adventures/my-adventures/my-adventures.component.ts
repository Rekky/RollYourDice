import {Component, OnDestroy, OnInit} from '@angular/core';
import {Game} from '../../../classes/Game';
import {GameInteractor} from '../../../interactors/GameInteractor';
import {User} from '../../../classes/User';
import {UserInteractor} from '../../../interactors/UserInteractor';
import {Subscription} from 'rxjs';
import {MapInteractor} from '../../../interactors/MapInteractor';
import { OurKonvaMap } from 'src/app/classes/ourKonva/OurKonvaMap';

@Component({
    selector: 'app-my-adventures',
    templateUrl: './my-adventures.component.html',
    styleUrls: ['./my-adventures.component.scss']
})
export class MyAdventuresComponent implements OnInit, OnDestroy {

    adventures: Game[] = [];
    displayOptions: string = null;
    displayedGameIndex: number = 999999;
    adventuresImages: string[] = [];
    currentUser: User;
    gameToEdit: Game | null = null;

    userSubscription: Subscription;

    constructor(private gameInteractor: GameInteractor,
                private mapInteractor: MapInteractor,
                private userInteractor: UserInteractor) {
        this.currentUser = this.userInteractor.getUser();

    }

    async ngOnInit(): Promise<void> {
        await this.getMyGames();
    }

    ngOnDestroy(): void {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    }

    createNewGame(): void {
        this.gameToEdit = new Game(this.currentUser.id);
        this.displayOptions = null;
    }

    async getMyGames(): Promise<void>  {
        try {
            const response: any = await this.gameInteractor.getMyGames();
            this.adventures = response.data;
        } catch (e) {
            console.log(e);
        }
    }

    async editGame(adventure: Game, e: Event): Promise<void> {
        this.gameToEdit = adventure;
        this.displayOptions = null;
        e.stopPropagation();
    }

    async deleteGame(adventure: Game, i: number, e: Event): Promise<void> {
        e.stopPropagation();
        try {
            await this.gameInteractor.removeGame(adventure.id);
            this.adventures.splice(i, 1);
            this.displayOptions = null;
        } catch (e) {
            console.log(e);
        }
    }

    async saveGame(game: Game): Promise<void> {
        try {
            if (this.gameToEdit.id) {
                await this.gameInteractor.editGame(game);
                const adventureIndex = this.adventures.findIndex((adventure: Game) => {
                    return adventure.id === game.id;
                });
                this.adventures[adventureIndex] = game;
            } else {
                const newGame = await this.gameInteractor.createGame(game);
                game.id = newGame.id;
                this.adventures.unshift(game);
                // await this.getMyGames();
            }
            this.closeEditGame();
            this.displayOptions = null;
        } catch (e) {
            console.log(e);
        }
    }

    selectDisplayOptions(e: Event, id: string): void {
        this.displayOptions = id;
        e.stopPropagation();
    }

    unselectDisplayOptions(e: Event): void {
        this.displayOptions = null;
        e.stopPropagation();
    }

    loadGame(adventure: Game): void {
        // TODO delete this code
        adventure.authorId = this.currentUser.id;
        //
        this.gameInteractor.goToTheGame(adventure);
    }

    closeEditGame(): void {
        this.gameToEdit = null;
    }

    // TODO delete this!!!!
    logout(): void {
        this.userInteractor.logout();
    }

}
