import {Component, OnDestroy, OnInit} from '@angular/core';
import {Game} from '../../../classes/Game';
import {GameInteractor} from '../../../interactors/GameInteractor';
import {User} from '../../../classes/User';
import {UserInteractor} from '../../../interactors/UserInteractor';
import {Subscription} from 'rxjs';
import {MapInteractor} from '../../../interactors/MapInteractor';
import {MatDialog} from '@angular/material/dialog';
import {EditGameDataComponent} from '../../../components/edit-game-data/edit-game-data.component';
import {SocketService} from '../../../services/socket.service';
import {Router} from '@angular/router';
import {SearchGameComponent} from '../../../components/search-game/search-game.component';
import {Coords} from '../../../classes/Coords';
import { UserListComponent } from 'src/app/components/user-list/user-list.component';
import {MyAdventuresInteractor} from './my-adventures-interactor';
import {AssetInteractor} from '../../../interactors/AssetInteractor';
import {AssetModel} from '../../../classes/AssetModel';

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
    myAdventuresSub: Subscription;

    constructor(private gameInteractor: GameInteractor,
                private mapInteractor: MapInteractor,
                private userInteractor: UserInteractor,
                private myAdventuresInteractor: MyAdventuresInteractor,
                private dialog: MatDialog,
                private socketService: SocketService,
                private assetInteractor: AssetInteractor,
                private router: Router) {
        this.currentUser = this.userInteractor.getCurrentUser();
        this.myAdventuresSub = this.myAdventuresInteractor.getMyAdventures().subscribe(adv => {
            this.adventures = adv;
            // adv.forEach(element => {
            //     element.playersRequested
            // });
        });
    }

    async ngOnInit(): Promise<void> {
        this.followMouse();
    }

    ngOnDestroy(): void {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
        this.myAdventuresSub?.unsubscribe();
    }

    startNewGame(): void {
        const dialogSub = this.dialog.open(EditGameDataComponent, {
            data: new Game()
        }).afterClosed().subscribe(res => {
            if (res) {
                this.createNewGame(res.game, res.formData);
            }
            dialogSub.unsubscribe();
        });
    }

    async createNewGame(game, asset): Promise<void> {
        this.displayAdventureSettings(null);
        try {
            const newGame = await this.gameInteractor.createGame(game, asset);
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
            // const newGame = await this.gameInteractor.createGame(duplicatedAdventure);
            // this.adventures.unshift(newGame);
        }
        catch (e) {
            console.error(e);
        }
    }

    async editGame(adventure: Game, i: number, e: Event): Promise<void> {
        e.stopPropagation();
        this.displayAdventureSettings(null);
        const dialogSub = this.dialog.open(EditGameDataComponent, {
            data: adventure
        }).afterClosed().subscribe(async res => {
            if (res) {
                try {
                    if (res.formData) {
                        const assetResponse: AssetModel[] = await this.assetInteractor.uploadFile(res.formData);
                        (res.game as Game).coverImage = assetResponse[0];
                    }
                    await this.gameInteractor.editGame(res.game);
                    this.adventures[i] = Game.fromJSON(res.game);
                }
                catch (e) {
                    console.error(e);
                }
            }
            dialogSub.unsubscribe();
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

    cancelGameRequest(adventure: Game, i: number, e: Event): void {
        e.stopPropagation();
        this.socketService.cancelJoinGameRequest(adventure.id, this.currentUser.id);
        this.displayAdventureSettings(null);
    }

    displayUsersList(game: Game, e: Event): void {
        e.stopPropagation();
        const dialogSub = this.dialog.open(UserListComponent, {
            data: {players: game.players, playersRequest: game.playersRequested, game: game}
        }).afterClosed().subscribe(res => {
            dialogSub.unsubscribe();
        });
    }

    async saveGame(data: any): Promise<void> {
        const game = data.game;
        const formData = data.formData;
        try {
            if (this.gameToEdit.id) {
                await this.gameInteractor.editGame(game);
                const adventureIndex = this.adventures.findIndex((adventure: Game) => {
                    return adventure.id === game.id;
                });
                this.adventures[adventureIndex] = game;
            }
        } catch (e) {
            console.log(e);
        }
    }

    searchGame(): void {
        const dialogSub = this.dialog.open(SearchGameComponent, {
        }).afterClosed().subscribe(res => {
            if (res?.gameId) {
                this.myAdventuresInteractor.addAdventure(res.gameId);
            }
            dialogSub.unsubscribe();
        });
    }

    loadGame(adventure: Game): void {
        if (this.isAccessRequested(adventure) === true) {
            return;
        }
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

    isAccessRequested(adventure: Game): boolean {
        return !!adventure.playersRequested?.find(player => player.id === this.currentUser.id);
    }

}
