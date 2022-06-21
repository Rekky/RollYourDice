import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {GameInteractor} from '../../interactors/GameInteractor';
import {Game, GameStatus} from '../../classes/Game';
import {MouseService} from '../../services/mouse.service';
import {OurKonvaMap, OurKonvaMapModification} from '../../classes/ourKonva/OurKonvaMap';
import {SocketService} from '../../services/socket.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {MouseInteractor} from '../../interactors/MouseInteractor';
import {UserInteractor} from '../../interactors/UserInteractor';
import {CurrentSelectedKonvaObject} from '../../classes/ourKonva/OurKonvaMouse';
import {MapInteractor} from '../../interactors/MapInteractor';
import { MyAdventuresInteractor } from '../launcher/my-adventures/my-adventures-interactor';
import {withIdentifier} from 'codelyzer/util/astQuery';

@Component({
    selector: 'app-game-editor',
    templateUrl: './game-editor.component.html',
    styleUrls: ['./game-editor.component.scss']
})
export class GameEditorComponent implements OnInit, OnDestroy {
    map: OurKonvaMap;
    mapModification: OurKonvaMapModification;
    game: Game;
    maps: OurKonvaMap[] = [];
    gameStatus: GameStatus = GameStatus.Stopped;
    GameStatus = GameStatus;

    leftColumnTabs = LeftColumnTabs;
    tabs: LeftColumnTabs = LeftColumnTabs.Library;
    currentObjectSelected: any;
    mouse: any;
    selectedKonvaObject: CurrentSelectedKonvaObject;
    openMapList = false;
    leftSidebarTitle: string = 'MAPS';

    getMouseObservableSubscription: Subscription;
    getSelectedKonvaObjectSubscription: Subscription;
    getCurrentMapModificationSubs: Subscription;

    destroying: boolean = false;

    // ZOOM
    currentZoomOptions = {
        min: 0.3,
        max: 3,
        step: 0.1,
        value: 1
    };


    constructor(public gameInteractor: GameInteractor,
                private mapInteractor: MapInteractor,
                private mouseInteractor: MouseInteractor,
                private mouseService: MouseService,
                private router: ActivatedRoute,
                private socketService: SocketService,
                public userInteractor: UserInteractor,
                public myAdventureInteractor: MyAdventuresInteractor,
                private cdr: ChangeDetectorRef) {
        this.mapInteractor.getCurrentMapObs().subscribe(map => {
            if (map) {
                this.destroying = true;
                this.mouseInteractor.unsetSelectedKonvaObject();
                this.map = map;

                setTimeout(() => {
                    this.destroying = false;
                });
            }
        });
    }

    async ngOnInit(): Promise<void> {
        try {
            const gameId = this.router.snapshot.paramMap.get('id');
            this.socketService.sendPlayerEnterGame(gameId);

            // 1. Call to get game info
            this.game = await this.gameInteractor.getGame(gameId);

            // 2. Call to get map's list and set first map as selected
            this.maps = await this.mapInteractor.getAllMaps(gameId);

            // 2.1 Seteo de meta
            const metaMapIndex = this.maps.findIndex(map => map.id === this.userInteractor.getCurrentUser()?.meta?.selectedMapId);
            if (metaMapIndex !== -1) {
                this.mapInteractor.setCurrentMap(this.maps[metaMapIndex]);
            } else {
                this.mapInteractor.setCurrentMap(this.maps[0]);
            }

            // 3. Socket connection with map selected
            this.gameInteractor.setCurrentGame(this.game);
            if (this.game?.mapsId) {
                this.gameStatus = this.game.status;
            }

            this.getMouseObservableSubscription = this.mouseService.getMouseObservable().subscribe(mouse => {
                this.mouse = mouse;
            });
            this.getSelectedKonvaObjectSubscription = this.mouseInteractor.getSelectedKonvaObjectObservable().subscribe(konva => {
                this.selectedKonvaObject = konva;
            });

            this.getCurrentMapModificationSubs = this.mapInteractor.getCurrentMapModificationObs().subscribe((res) => {
                if (res) {
                    this.mapModification = res;
                    this.cdr.detectChanges();
                }
            });
            this.myAdventureInteractor.getMyAdventures().subscribe((adventures: Game[]) => {
                if (adventures) {
                    const currentGame: Game = adventures.find((game: Game) => game.id === this.game.id);
                    if (currentGame) {
                        this.gameStatus = currentGame.status;
                    }
                }
            });

            this.cdr.detectChanges();
        }
        catch (e) {
            console.error(e);
        }
    }

    ngOnDestroy(): void {
        if (this.getMouseObservableSubscription) {
            this.getMouseObservableSubscription.unsubscribe();
        }
        if (this.getSelectedKonvaObjectSubscription) {
            this.getSelectedKonvaObjectSubscription.unsubscribe();
        }
        if (this.getCurrentMapModificationSubs) {
            this.getCurrentMapModificationSubs.unsubscribe();
        }
    }

    updateProperties(ev): void {
        this.map = {...ev};
    }

    onSelectedMap(ev: OurKonvaMap): void {
        this.currentZoomOptions.value = 1;
        this.mapInteractor.setCurrentMap(ev);
        this.socketService.sendMetaSelectedMap(this.mapInteractor.getCurrentMap().id);
    }

    onCreateMap(map: OurKonvaMap): void {
        console.log('map =', map);
        this.socketService.sendGameCreateMap(this.gameInteractor.getCurrentGame().id, map);
    }

    onDeleteMap(map: OurKonvaMap): void {
        this.socketService.sendGameDeleteMap(this.gameInteractor.getCurrentGame().id, map);
    }

    onUpdateMap(map: OurKonvaMap): void {
        this.socketService.sendGameUpdateMap(this.gameInteractor.getCurrentGame().id, map);
    }

    onMapsOrderChange(maps: OurKonvaMap[]): void {
        this.socketService.sendGameUpdateMapsOrder(this.gameInteractor.getCurrentGame().id, maps);
    }

    onMapMove(map: OurKonvaMap): void {
        // this.socketService.sendGameMoveMap(map);
    }

    // USADA EN MOUSEINTERACTOR
    // onCreateMapObject(object: any): void {
    //     this.socketService.sendGameCreateMapObject(this.map.id, object);
    // }

    onSetCurrentObjectSelected(ev): void {
        this.currentObjectSelected = ev;
    }

    onMapsChange(maps: OurKonvaMap[]): void {
        // this.socketService.sendGameMapsUpdate(this.game.id, this.selectedPage.id, maps);
    }

    onToPlayersMap(map: OurKonvaMap): void {
        // this.socketService.sendGameSetToPlayersMap(this.game.id, this.selectedPage.id, map);
    }

    onStatusChange(status: GameStatus): void {
        this.gameStatus = status;
        this.socketService.sendGameStatus(this.game.id, this.gameStatus);
    }

    onScaleChange(zoom: number): void {
        this.currentZoomOptions.value = zoom;
    }

    onTabsChange(tab: number): void {
        if (tab === 0) {
            this.leftSidebarTitle = 'MAPS';
        } else if (tab === 1){
            this.leftSidebarTitle = 'MAP OBJECTS';
        } else if (tab === 2){
            this.leftSidebarTitle = 'ASSETS';
        } else {
            this.leftSidebarTitle = 'CAMERAS';
        }
    }

}

export enum LeftColumnTabs {
    Maps = 'maps',
    Library = 'library'
}
