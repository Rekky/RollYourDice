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
import {SocketService} from '../../../services/socket.service';
import {Router} from '@angular/router';

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
    gameStatusUpdatesSub: Subscription;

    constructor(private gameInteractor: GameInteractor,
                private mapInteractor: MapInteractor,
                private userInteractor: UserInteractor,
                private dialog: MatDialog,
                private socketService: SocketService,
                private router: Router) {
        this.currentUser = this.userInteractor.getCurrentUser();
        this.gameStatusUpdatesSub = this.gameInteractor.getGameStatusObs().subscribe(update => {
            const updateGameIndex = this.adventures.findIndex(adv => adv.id === update.gameId);
            this.adventures[updateGameIndex].status = update.status;
        });
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
            if (res) {
                this.createNewGame(res.game);
            }
        });
    }

    async createNewGame(game): Promise<void> {
        this.displayAdventureSettings(null);
        try {
            const newGame = await this.gameInteractor.createGame(game, null);
            this.adventures.unshift(newGame);
        }
        catch (e) {
            console.error(e);
        }
    }

    async duplicateGame(adventure: Game, e: Event): Promise<void> {
        e.stopPropagation();
        this.displayAdventureSettings(null);
        try {
            const duplicatedAdventure = Game.fromJSON(adventure);
            duplicatedAdventure.id = null;
            duplicatedAdventure.name = duplicatedAdventure.name + ' (duplicated)';
            const newGame = await this.gameInteractor.createGame(duplicatedAdventure, null);
            this.adventures.unshift(newGame);
        }
        catch (e) {
            console.error(e);
        }
    }

    async editGame(adventure: Game, i: number, e: Event): Promise<void> {
        e.stopPropagation();
        this.displayAdventureSettings(null);
        this.dialog.open(EditGameDataComponent, {
            data: adventure
        }).afterClosed().subscribe(async res => {
            console.log('CLOSED =', res);
            if (res) {
                try {
                    await this.gameInteractor.editGame(res.game, null);
                    this.adventures[i] = Game.fromJSON(res.game);
                }
                catch (e) {
                    console.error(e);
                }
            }
        });
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

    searchGame(): void {

    }

    loadGame(adventure: Game): void {
        this.socketService.sendPlayerEnterGame(adventure.id);
        this.router.navigate(['/game-editor/', adventure.id]);
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
