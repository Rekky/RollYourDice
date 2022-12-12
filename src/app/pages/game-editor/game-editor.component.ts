import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {GameInteractor} from '../../interactors/GameInteractor';
import {Game, GameStatusEnum} from '../../classes/Game';
import {MouseService} from '../../services/mouse.service';
import {OurKonvaMap, OurKonvaMapModification} from '../../classes/ourKonva/OurKonvaMap';
import {SocketService} from '../../services/socket.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {MouseInteractor} from '../../interactors/MouseInteractor';
import {UserInteractor} from '../../interactors/UserInteractor';
import {CurrentSelectedKonvaObject} from '../../classes/ourKonva/OurKonvaObject';
import {MapInteractor} from '../../interactors/MapInteractor';
import {MyAdventuresInteractor} from '../../interactors/my-adventures-interactor';
import {MetaInteractor} from '../../interactors/MetaInteractor';
import {Meta, MetaGame, MetaMap} from '../../classes/Meta';
import {LibraryInteractor} from '../../interactors/LibraryInteractor';
import {delay, retry, switchMap, tap} from 'rxjs/operators';
import {BlueprintInteractor} from '../../interactors/BlueprintInteractor';
import {OurKonvaActor} from '../../classes/ourKonva/OurKonvaActor';
import {Actor} from '../../classes/Actor';
import {AssetModel} from '../../classes/AssetModel';

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
    destroying: boolean = false;

    gameStatus: GameStatusEnum = GameStatusEnum.STOPPED;
    GameStatus = GameStatusEnum;
    currentObjectSelected: any;
    mouse: any;
    selectedKonvaObject: CurrentSelectedKonvaObject;
    openMapList = false;
    openLibraryList = false;
    leftSidebarTitle: string = 'MAPS';
    blueprintActor: Actor;

    // ZOOM
    zoomOptions = {
        min: 0.3,
        max: 3,
        scale: 1,
        stepScale: 0.1
    };

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
                private cdr: ChangeDetectorRef,
                private blueprintInteractor: BlueprintInteractor) {

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
                            this.executeBlueprints();
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

                            const foundMetaMap: MetaMap = foundMetaGame.maps.find((metaMap: MetaMap) => metaMap.id === this.currentMap?.id);
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
                        }
                    })
                );
            }),
            switchMap((res) => {
                return this.mapInteractor.getCurrentMapObs().pipe(
                    tap((_res: OurKonvaMap) => {
                        if (_res && this.currentMap) {
                            const currentMetaGameFound: MetaGame = this.metaInteractor.getUserMeta().games
                                .find((game: MetaGame) => game.id === this.gameInteractor.getCurrentGame().id);
                            if (currentMetaGameFound) {
                                const currentMetaMapFound: MetaMap = currentMetaGameFound.maps
                                    .find((map: MetaMap) => map.id === this.currentMap.id);
                                if (currentMetaMapFound) {
                                    this.currentMap.stage.attrs = currentMetaMapFound.attrs;
                                }
                            }
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
                                console.log('currentGameStatus', currentGame);
                            }
                        }
                    })
                );
            }),
            // 9.
            switchMap((res) => {
                return this.blueprintInteractor.getDisplayedBlueprintActorObs().pipe(
                    tap((blueprintActor: Actor) => {
                        this.blueprintActor = blueprintActor;
                        console.log(blueprintActor);
                    })
                );
            }),
            // 10. Socket connection with game selected
            tap(() => {
                setTimeout(() => { this.destroying = false; });
                this.cdr.detectChanges();
            })
        ).subscribe();
    }

    ngOnInit(): void {

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
        this.mapInteractor.setCurrentMap(this.currentMap);
        this.socketService.sendMetaSelectedMap(this.currentMap.id);
        setTimeout(() => { this.destroying = false; });
    }

    onCreateMap(map: OurKonvaMap): void {
        console.log('onCreateMap', map);
        this.zoomOptions.scale = 1;
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

    onScaleChange(zoom: number): void {
        // set zoom to current Map
        this.currentMap.stage.attrs.scaleX = zoom;
        this.currentMap.stage.attrs.scaleY = zoom;

        // set option scale to current zoom
        this.zoomOptions.scale = zoom;

        // call to dragMap for save the new scale
        this.onMapDrag({scaleX: zoom, scaleY: zoom});
    }

    onMapDrag(attrs: any): void {
        const userMeta: Meta = this.metaInteractor.getUserMeta();
        const metaMapFound: MetaMap = userMeta.games
            .find((metaGame: MetaGame) => metaGame.id === this.gameInteractor.getCurrentGame().id).maps
            .find((metaMap: MetaMap) => metaMap.id === this.currentMap.id);

        // not have metaMap
        if (!metaMapFound) {
            const newMetaMap: MetaMap = new MetaMap(this.currentMap.id, attrs);
            userMeta.games.find((metaGame: MetaGame) => metaGame.id === this.gameInteractor.getCurrentGame().id).maps.push(newMetaMap);
            this.socketService.sendMeta(this.metaInteractor.getUserMeta());
            return;
        }

        // have metaMap
        metaMapFound.attrs = {...metaMapFound.attrs, ...attrs};
        this.socketService.sendMeta(this.metaInteractor.getUserMeta());
    }

    onStatusChange(status: GameStatusEnum): void {
        this.gameStatus = status;
        this.executeBlueprints();
        this.socketService.sendGameStatus(this.game.id, this.gameStatus);
    }

    executeBlueprints(): void {
        if (this.gameStatus === GameStatusEnum.RUNNING) {
            this.currentMap.objects.forEach((obj: AssetModel | Actor) => {
                const actor = obj as Actor;
                if (!actor.blueprint) { return; }
                this.blueprintInteractor.loadBlueprintOnInit(actor.blueprint);
            });
        }
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

}
