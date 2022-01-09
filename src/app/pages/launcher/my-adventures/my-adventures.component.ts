import {Component, OnDestroy, OnInit} from '@angular/core';
import {Game} from '../../../classes/Game';
import {GameInteractor} from '../../../interactors/GameInteractor';
import {User} from '../../../classes/User';
import {UserInteractor} from '../../../interactors/UserInteractor';
import {Subscription} from 'rxjs';
import {MapInteractor} from '../../../interactors/MapInteractor';
import { OurKonvaMap } from 'src/app/classes/ourKonva/OurKonvaMap';
import {Coords} from "../../../classes/Coords";
import {MatDialog} from '@angular/material/dialog';
import {EditGameDataComponent} from '../../../components/edit-game-data/edit-game-data.component';

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
    adventuresImages: string[] = [];
    currentUser: User;
    gameToEdit: Game | null = null;

    adventureSettingsDisplayedId: string = null;

    userSubscription: Subscription;

    constructor(private gameInteractor: GameInteractor,
                private mapInteractor: MapInteractor,
                private userInteractor: UserInteractor,
                private dialog: MatDialog) {
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
            console.error(e);
        }
    }

    startNewGame(): void {
        this.dialog.open(EditGameDataComponent, {
            data: new Game()
        }).afterClosed().subscribe(res => {
            console.log('CLOSED =', res);
        });
    }

    async createNewGame(): Promise<void> {
        try {
            const game = new Game();
            const newGame = await this.gameInteractor.createGame(game, null);
            this.adventures.push(newGame);
            this.displayAdventureSettings(null);
        }
        catch (e) {
            console.error(e);
        }
    }

    async duplicateGame(adventure: Game, $event): Promise<void> {
        try {
            const duplicatedAdventure = Game.fromJSON(adventure);
            duplicatedAdventure.id = null;
            const newGame = await this.gameInteractor.createGame(duplicatedAdventure, null);
            this.adventures.push(newGame);
            this.displayAdventureSettings(null);
        }
        catch (e) {
            console.error(e);
        }
    }

    async editGame(adventure: Game, e: Event): Promise<void> {
        try {
            adventure.maxNPlayers = 19;
            await this.gameInteractor.editGame(adventure, null);
            e.stopPropagation();
        }
        catch (e) {

        }
    }

    async deleteGame(adventure: Game, i: number, e: Event): Promise<void> {
        e.stopPropagation();
        try {
            await this.gameInteractor.removeGame(adventure.id);
            this.adventures.splice(i, 1);
            this.displayAdventureSettings(null);
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
            if (bg) {
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
            }
        });
    }

    startFollowingMouse(advId: string): void {
        this.adventureFollowingId = advId;
    }

    stopFollowingMouse(): void {
        this.bgX = 50;
        const bg = document.getElementById(this.adventureFollowingId);
        if (bg) {
            bg.style.transition = 'background-position 300ms';
            bg.style.backgroundPosition = '50%';
            this.adventureFollowingId = null;
            setTimeout(() => {
                bg.style.transition = 'none';
            }, 300);
        }
    }

    displayAdventureSettings(id: string, e?: Event): void {
        e?.stopPropagation();
        e?.preventDefault();
        if (this.adventureSettingsDisplayedId && id) {
            this.adventureSettingsDisplayedId = this.adventureSettingsDisplayedId === id ? null : id;
        } else {
            this.adventureSettingsDisplayedId = id;
        }
    }

}
