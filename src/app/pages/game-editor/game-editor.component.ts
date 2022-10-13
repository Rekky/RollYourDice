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
import {CurrentSelectedKonvaObject, OurKonvaObject} from '../../classes/ourKonva/OurKonvaObject';
import {MapInteractor} from '../../interactors/MapInteractor';
import { MyAdventuresInteractor } from '../launcher/my-adventures/my-adventures-interactor';
import {MetaInteractor} from '../../interactors/MetaInteractor';
import {Meta, MetaGame, MetaMap} from '../../classes/Meta';
import {LibraryInteractor} from '../../interactors/LibraryInteractor';
import {Actor} from '../../classes/Actor';
import {OurKonvaLayers} from '../../classes/ourKonva/OurKonvaLayers';
import {Player} from '../../classes/User';
import {OurKonvaRect} from '../../classes/ourKonva/OurKonvaRect';
import {OurKonvaImage} from '../../classes/ourKonva/OurKonvaImage';
import {delay, retry, retryWhen, switchMap, tap} from 'rxjs/operators';

@Component({
    selector: 'app-game-editor',
    templateUrl: './game-editor.component.html',
    styleUrls: ['./game-editor.component.scss']
})
export class GameEditorComponent implements OnInit, OnDestroy {
    currentMap: OurKonvaMap;
    mapModification: OurKonvaMapModification;
    game: Game;
    maps: OurKonvaMap[] = [];

    gameStatus: GameStatus = GameStatus.Stopped;
    GameStatus = GameStatus;
    currentObjectSelected: any;
    mouse: any;
    selectedKonvaObject: CurrentSelectedKonvaObject;
    openMapList = false;
    openLibraryList = false;
    leftSidebarTitle: string = 'MAPS';
    destroying: boolean = false;
    isBlueprintDisplayed: boolean = false;

    // ZOOM
    currentZoomOptions = {
        minScale: 0.3,
        maxScale: 3,
        stepScale: 0.1,
        scale: 1
    };

    // Library
    library: any[] = [];

    $getMouseObservableSubscription: Subscription;
    $getSelectedKonvaObjectSubscription: Subscription;
    $getCurrentMapModificationSubs: Subscription;
    $mapInteractorSubs: Subscription;
    $metaSubs: Subscription;

    constructor(public gameInteractor: GameInteractor,
                private mapInteractor: MapInteractor,
                private mouseInteractor: MouseInteractor,
                private mouseService: MouseService,
                private router: ActivatedRoute,
                private socketService: SocketService,
                public userInteractor: UserInteractor,
                private metaInteractor: MetaInteractor,
                public myAdventureInteractor: MyAdventuresInteractor,
                public libraryInteractor: LibraryInteractor,
                private cdr: ChangeDetectorRef) {

        const gameId = this.router.snapshot.paramMap.get('id');

        this.gameInteractor.getGameObs(gameId).pipe(
            // 1. call to game from gameId url
            tap((game: Game) => {
                this.game = game;
                this.socketService.sendPlayerEnterGame(gameId);
                this.destroying = true;
            }),
            tap(() => {
                this.gameInteractor.setCurrentGame(this.game);
                if (this.game?.mapsId) {
                    this.gameStatus = this.game.status;
                }
            }),
            // 2. call maps from current game
            switchMap((game) => {
                return this.mapInteractor.getAllMapsObs(game.id).pipe(
                    tap((maps) => {
                        this.maps = maps.data ?? [];
                        if (this.maps.length > 0) {
                            this.currentMap = this.maps[0];
                            this.mapInteractor.setCurrentMap(this.maps[0]);
                        }
                    })
                );
            }),
            // 3. call meta from server and set attrs map
            switchMap((res) => {
                return this.metaInteractor.getUserMetaObs().pipe(
                    delay(500),
                    tap((meta: Meta) => {
                        console.log('getUserMeta', meta);
                        if (meta) {
                            const foundMetaGame: MetaGame = meta.games
                                .find((metaGame: MetaGame) => metaGame.id === this.gameInteractor.getCurrentGame().id);

                            if (!foundMetaGame) {
                                const newMetaGame: MetaGame = new MetaGame(this.gameInteractor.getCurrentGame().id);
                                this.metaInteractor.getUserMeta().games.push(newMetaGame);
                                this.socketService.sendMeta(this.metaInteractor.getUserMeta());
                                return;
                            }

                            const foundMetaMap: MetaMap = foundMetaGame.maps.find((metaMap: MetaMap) => metaMap.id === this.currentMap.id);
                            if (foundMetaMap) {
                                this.currentMap.stage.attrs = foundMetaMap.attrs;
                            }
                        } else {
                            throw new Error('meta not load');
                        }
                    }),
                    retry(10)
                );
            }),
            // 5.
            switchMap((res) => {
                return this.mouseService.getMouseObservable().pipe(
                    tap((mouse) => {
                        this.mouse = mouse;
                    })
                );
            }),
            // 6.
            switchMap((res) => {
                return this.mouseInteractor.getSelectedKonvaObjectObservable().pipe(
                    tap((selectedObject: CurrentSelectedKonvaObject[] | null) => {
                        if (selectedObject) {
                            this.selectedKonvaObject = selectedObject[0];
                        }
                    })
                );
            }),
            // 7.
            switchMap((res) => {
                return this.mapInteractor.getCurrentMapModificationObs().pipe(
                    tap((_res: OurKonvaMapModification) => {
                        if (res) {
                            this.mapModification = _res;
                            this.cdr.detectChanges();
                        }
                    })
                );
            }),
            // 8.
            switchMap((res) => {
                return this.myAdventureInteractor.getMyAdventures().pipe(
                    tap((games: Game[]) => {
                        if (games) {
                            const currentGame: Game = games.find((game: Game) => game.id === this.game.id);
                            if (currentGame) {
                                this.gameStatus = currentGame.status;
                            }
                        }
                    })
                );
            }),
            // 9. Socket connection with game selected
            tap(() => {
                setTimeout(() => { this.destroying = false; });
                this.cdr.detectChanges();
            })
        ).subscribe();

        this.libraryInteractor.getCurrentLibraryObs().subscribe(library => {
            this.library = [{type: 'CHARACTERS', items: library}];
        });
    }

    async ngOnInit(): Promise<void> {
        // try {
            // const gameId = this.router.snapshot.paramMap.get('id');
            // this.socketService.sendPlayerEnterGame(gameId);

            // 1. Call to get game info
            // this.game = await this.gameInteractor.getGame(gameId);

            // 2. Call to get map's list
            // combineLatest(this.mapInteractor.getAllMapsObs(gameId), this.metaInteractor.getUserMetaObs()).subscribe((result: any) => {
            //     const maps = result[0].data ?? [];
            //     const meta = result[1] ?? {};
            //     this.maps = maps;
            //
            //     // === META === select last selected map from meta
            //     if (meta && meta.maps && meta.maps.length > 0) {
            //         const mapFound = this.maps.find(map => map.id === meta.maps[0].id);
            //         this.mapInteractor.setCurrentMap(mapFound);
            //     } else {
            //         this.mapInteractor.setCurrentMap(this.maps[0]);
            //     }
            // });

            // // 3. Socket connection with map selected
            // this.gameInteractor.setCurrentGame(this.game);
            // if (this.game?.mapsId) {
            //     this.gameStatus = this.game.status;
            // }
            //
            // this.$getMouseObservableSubscription = this.mouseService.getMouseObservable().subscribe(mouse => {
            //     this.mouse = mouse;
            // });
            // this.$getSelectedKonvaObjectSubscription = this.mouseInteractor.getSelectedKonvaObjectObservable()
            //     .subscribe((selectedObject: CurrentSelectedKonvaObject[] | null) => {
            //     if (selectedObject) {
            //         this.selectedKonvaObject = selectedObject[0];
            //     }
            // });
            //
            // this.$getCurrentMapModificationSubs = this.mapInteractor.getCurrentMapModificationObs().subscribe((res) => {
            //     if (res) {
            //         this.mapModification = res;
            //         this.cdr.detectChanges();
            //     }
            // });
            // this.myAdventureInteractor.getMyAdventures().subscribe((adventures: Game[]) => {
            //     if (adventures) {
            //         const currentGame: Game = adventures.find((game: Game) => game.id === this.game.id);
            //         if (currentGame) {
            //             this.gameStatus = currentGame.status;
            //         }
            //     }
            // });
            //
            // this.cdr.detectChanges();
        // }
        // catch (e) {
        //     console.error(e);
        // }
    }

    ngOnDestroy(): void {
        if (this.$getMouseObservableSubscription) {
            this.$getMouseObservableSubscription.unsubscribe();
        }
        if (this.$getSelectedKonvaObjectSubscription) {
            this.$getSelectedKonvaObjectSubscription.unsubscribe();
        }
        if (this.$getCurrentMapModificationSubs) {
            this.$getCurrentMapModificationSubs.unsubscribe();
        }
        if (this.$mapInteractorSubs) {
            this.$mapInteractorSubs.unsubscribe();
        }
        if (this.$metaSubs) {
            this.$metaSubs.unsubscribe();
        }
    }

    updateProperties(ev): void {
        this.currentMap = {...ev};
    }

    onSelectedMap(map: OurKonvaMap): void {
        this.destroying = true;
        this.currentMap = map;

        // // ============== meta =================== //
        const meta = this.metaInteractor.getUserMeta();
        if (meta) {
            // const foundMeta: MetaMap = meta.maps.find((_map: MetaMap) => _map.id === this.currentMap.id);

            // if (foundMeta) {
            //     console.log('onSelectedMap_foundMetaMap');
                //     const metaMap: MetaMap = new MetaMap(foundMeta?.id, foundMeta?.attrs);
                //     console.log('metaMap', metaMap);
                //     console.log('this.currentMap', this.currentMap);
                //     this.currentMap = metaMap.setMetaMap(this.currentMap);
                //     this.mapInteractor.setCurrentMap(this.currentMap);
            // } else {
            //     console.log('onSelectedMap_notFoundMetaMap');
            // }
        }
        // // ======================================= //
        this.mapInteractor.setCurrentMap(this.currentMap);
        this.socketService.sendMetaSelectedMap(this.currentMap.id);

        setTimeout(() => { this.destroying = false; });
    }

    onCreateMap(map: OurKonvaMap): void {
        console.log('onCreateMap', map);
        this.currentZoomOptions.scale = 1;
        this.socketService.sendGameCreateMap(this.gameInteractor.getCurrentGame().id, map);
    }

    onDeleteMap(map: OurKonvaMap): void {
        if (this.currentMap.id === map.id) {
            this.currentMap = null;
        }
        this.mapInteractor.setCurrentMap(this.maps[this.maps.length - 1] ?? null);
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

    onMapDrag(attrs: any): void {
        const userMeta: Meta = this.metaInteractor.getUserMeta();
        const metaMapFound: MetaMap = userMeta.games
            .find((metaGame: MetaGame) => metaGame.id === this.gameInteractor.getCurrentGame().id).maps
            .find((metaMap: MetaMap) => metaMap.id === this.currentMap.id);

        // not have metaMap
        if (!metaMapFound) {
            console.log('user dont have meta then CREATE META');
            const newMetaMap: MetaMap = new MetaMap(this.currentMap.id, attrs);
            userMeta.games.find((metaGame: MetaGame) => metaGame.id === this.gameInteractor.getCurrentGame().id).maps.push(newMetaMap);
            this.socketService.sendMeta(this.metaInteractor.getUserMeta());
            return;
        }

        // have metaMap
        metaMapFound.attrs = attrs;
        this.socketService.sendMeta(this.metaInteractor.getUserMeta());
    }

    onStatusChange(status: GameStatus): void {
        this.gameStatus = status;
        this.socketService.sendGameStatus(this.game.id, this.gameStatus);
    }

    onScaleChange(zoom: number): void {
        this.currentZoomOptions.scale = zoom;
        this.onMapDrag({scaleX: zoom, scaleY: zoom});
    }

    onTabsChange(tab: number): void {
        switch (tab) {
            case 0:
                this.leftSidebarTitle = 'MAPS';
                break;
            case 1:
                this.leftSidebarTitle = 'MAP OBJECTS';
                break;
            case 2:
                this.leftSidebarTitle = 'ASSETS';
                break;
            case 3:
                this.leftSidebarTitle = 'CAMERAS';
                break;
            default:
                this.leftSidebarTitle = 'UNKNOWN';
                break;
        }
    }

    onSelectedActor(actor: Actor): void {
        console.log('ActorToPaint->', actor);
        const ourKonvaObject = new OurKonvaObject(new Player());
        const ourKonvaImage = new OurKonvaImage(new Player(), actor.asset.uri);
        this.mouseInteractor.paintObjectOnMap(ourKonvaImage);
    }

    onDeleteActor(actor: Actor): void {
        this.libraryInteractor.deleteActor(actor);
    }

}
