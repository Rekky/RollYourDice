import {Component, OnDestroy, OnInit} from '@angular/core';
import {Game, GameTypes} from '../../../classes/Game';
import {GameInteractor} from '../../../interactors/GameInteractor';
import {User} from '../../../classes/User';
import {UserInteractor} from '../../../interactors/UserInteractor';
import {Subscription} from 'rxjs';
import {Page} from '../../../classes/Page';
import {Asset} from '../../../classes/Asset';
import {Coords} from '../../../classes/Coords';

@Component({
    selector: 'app-my-adventures',
    templateUrl: './my-adventures.component.html',
    styleUrls: ['./my-adventures.component.scss']
})
export class MyAdventuresComponent implements OnInit, OnDestroy {

    adventures: Game[] = [];
    displayOptions: boolean = false;
    displayedGameIndex: number = 999999;
    adventuresImages: string[] = [];
    currentUser: User;
    gameToEdit: Game | null = null;

    userSubscription: Subscription;

    constructor(private gameInteractor: GameInteractor,
                private userInteractor: UserInteractor) {
        this.currentUser = this.userInteractor.getCurrentUser();

    }

    async ngOnInit(): Promise<void> {
        try {
            this.adventures = await this.gameInteractor.getMyGames(this.currentUser.id);
            this.displayedGameIndex = this.adventures.length > 0 ? 0 : 999999;
            this.updateCarrouselImages();
        } catch (e) {
            console.log(e);
        }
    }

    ngOnDestroy(): void {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    }

    updateCarrouselImages(): void {
        if (this.adventures.length > 0) {
            this.adventuresImages = this.adventures.map(adventure => {
                return adventure.image.uri;
            });
        } else {
            this.adventuresImages = [];
        }
    }

    createNewGame(): void {
        this.gameToEdit = new Game(this.currentUser.id);
    }

    async editGame(): Promise<void> {
        this.displayOptions = false;
        this.gameToEdit = this.adventures[this.displayedGameIndex];
    }

    async deleteGame(): Promise<void> {
        try {
            await this.gameInteractor.removeGame(this.adventures[this.displayedGameIndex].id);
            this.adventures.splice(this.displayedGameIndex, 1);
            if (this.displayedGameIndex !== 0) {
                this.displayedGameIndex--;
            } else if (this.displayedGameIndex === 0 && this.adventures.length === 0) {
                this.displayedGameIndex = 999999;
            }
            this.updateCarrouselImages();
            this.displayOptions = false;
        } catch (e) {
            console.log(e);
        }
    }

    async saveGame(game: Game): Promise<void> {
        try {
            if (this.displayedGameIndex === 999999) {
                this.adventures.push(game);
                this.displayedGameIndex = this.adventures.length - 1;
                this.adventures[this.displayedGameIndex] = await this.gameInteractor.createGame(game);;
            } else {
                await this.gameInteractor.editGame(game);
                this.adventures[this.displayedGameIndex] = game;
            }
            this.gameToEdit = null;
            this.updateCarrouselImages();
        } catch (e) {
            console.log(e);
        }
    }

    closeEditGame(): void {
        this.gameToEdit = null;
    }

    loadGame(): void {
        this.gameInteractor.goToTheGame(this.adventures[this.displayedGameIndex]);
    }

}
