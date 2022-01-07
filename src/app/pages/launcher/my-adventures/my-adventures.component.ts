import {Component, OnDestroy, OnInit} from '@angular/core';
import {Game} from '../../../classes/Game';
import {GameInteractor} from '../../../interactors/GameInteractor';
import {User} from '../../../classes/User';
import {UserInteractor} from '../../../interactors/UserInteractor';
import {Subscription} from 'rxjs';
import {MapInteractor} from '../../../interactors/MapInteractor';
import { OurKonvaMap } from 'src/app/classes/ourKonva/OurKonvaMap';
import {Coords} from "../../../classes/Coords";

@Component({
    selector: 'app-my-adventures',
    templateUrl: './my-adventures.component.html',
    styleUrls: ['./my-adventures.component.scss']
})
export class MyAdventuresComponent implements OnInit, OnDestroy {
    mouseCoords: Coords = new Coords();
    bgX: number = 50;
    adventureFollowingId: string;

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
        this.currentUser = this.userInteractor.getCurrentUser();

    }

    async ngOnInit(): Promise<void> {
        await this.getMyGames();
        this.followMouse();
    }

    ngOnDestroy(): void {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    }

    async getMyGames(): Promise<void>  {
        try {
            const response: any = await this.gameInteractor.getMyGames();
            this.adventures = response.data;
        } catch (e) {
            console.log(e);
        }
    }

    createNewGame(): void {
        this.gameToEdit = new Game(this.currentUser.id);
        this.displayOptions = null;
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

    async saveGame(data: any): Promise<void> {
        const game = data.game;
        const formData = data.formData;

        try {
            if (this.gameToEdit.id) {
                await this.gameInteractor.editGame(game, formData);
                const adventureIndex = this.adventures.findIndex((adventure: Game) => {
                    return adventure.id === game.id;
                });
                this.adventures[adventureIndex] = game;
            } else {
                const newGame = await this.gameInteractor.createGame(game, formData);
                game.id = newGame.id;
                this.adventures.unshift(game);
            }
            this.displayOptions = null;
            await this.getMyGames();
        } catch (e) {
            console.log(e);
        }
    }

    loadGame(adventure: Game): void {
        this.gameInteractor.goToTheGame(adventure);
    }

    followMouse(): void {
        document.addEventListener('mousemove', ev => {
            const bg = document.getElementById(this.adventureFollowingId);
            bg.style.transition = 'none';
            if (this.adventureFollowingId) {
                if (this.mouseCoords.x > ev.offsetX) {
                    this.bgX = this.bgX + 0.02;
                } else if (this.mouseCoords.x < ev.offsetX) {
                    this.bgX = this.bgX - 0.02;
                }
                bg.style.backgroundPositionX = this.bgX + '%';
                this.mouseCoords.x = ev.offsetX;
            }
        });
    }

    startFollowingMouse(advId: string): void {
        this.adventureFollowingId = advId;
    }

    stopFollowingMouse(): void {
        this.bgX = 50;
        const bg = document.getElementById(this.adventureFollowingId);
        bg.style.transition = 'background-position 300ms';
        bg.style.backgroundPosition = '50%';
        this.adventureFollowingId = null;
        setTimeout(() => {
            bg.style.transition = 'none';
        }, 300);
    }

}
