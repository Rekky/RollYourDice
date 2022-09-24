import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {GameInteractor} from '../../interactors/GameInteractor';
import {Game, GameStatus} from '../../classes/Game';
import {MouseService} from '../../services/mouse.service';
import {OurKonvaMap, OurKonvaMapModification} from '../../classes/ourKonva/OurKonvaMap';
import {SocketService} from '../../services/socket.service';
import {combineLatest, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {MouseInteractor} from '../../interactors/MouseInteractor';
import {UserInteractor} from '../../interactors/UserInteractor';
import {CurrentSelectedKonvaObject, OurKonvaObject} from '../../classes/ourKonva/OurKonvaObject';
import {MapInteractor} from '../../interactors/MapInteractor';
import { MyAdventuresInteractor } from '../launcher/my-adventures/my-adventures-interactor';
import {MetaInteractor} from '../../interactors/MetaInteractor';
import {Meta, MetaMap} from '../../classes/Meta';
import {LibraryInteractor} from '../../interactors/LibraryInteractor';
import {Actor} from '../../classes/Actor';
import {OurKonvaLayers} from '../../classes/ourKonva/OurKonvaLayers';
import {Player} from '../../classes/User';

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
    currentObjectSelected: any;
    mouse: any;
    selectedKonvaObject: CurrentSelectedKonvaObject;
    openMapList = false;
    openLibraryList = false;
    leftSidebarTitle: string = 'MAPS';
    destroying: boolean = false;
    isBlueprintDisplayed: boolean = true;

    // META
    gameMeta: Meta = new Meta('', '');
    currentMapMeta: MetaMap;

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

        combineLatest(this.mapInteractor.getCurrentMapObs(), this.metaInteractor.getUserMetaObs()).subscribe(([map, meta]) => {
            if (map) {
                this.destroying = true;
                this.mouseInteractor.unsetSelectedKonvaObject();
                this.map = map;
            }
            if (map && meta) {
                this.gameMeta = meta;
                this.currentMapMeta = this.gameMeta.maps.find(m => m.id === map.id);

                if (this.currentMapMeta && this.currentMapMeta.attrs) {
                    this.currentZoomOptions.scale = this.currentMapMeta.attrs?.scaleX ?? 1;
                }
            }

            setTimeout(() => {
                this.destroying = false;
            });
        });

        this.libraryInteractor.getCurrentLibraryObs().subscribe(library => {
            this.library = [{type: 'CHARACTERS', items: library}];
            console.log('librarys--->', this.library);
        });
    }

    async ngOnInit(): Promise<void> {
        try {
            const gameId = this.router.snapshot.paramMap.get('id');
            this.socketService.sendPlayerEnterGame(gameId);

            // 1. Call to get game info
            this.game = await this.gameInteractor.getGame(gameId);

            // 2. Call to get map's list
            combineLatest(this.mapInteractor.getAllMapsObs(gameId), this.metaInteractor.getUserMetaObs()).subscribe((result: any) => {
                const maps = result[0].data ?? [];
                const meta = result[1] ?? {};
                this.maps = maps;

                // === META === select last selected map from meta
                if (meta && meta.maps && meta.maps.length > 0) {
                    const mapFound = this.maps.find(map => map.id === meta.maps[0].id);
                    this.mapInteractor.setCurrentMap(mapFound);
                } else {
                    this.mapInteractor.setCurrentMap(this.maps[0]);
                }
            });

            // 2.1 Load last selected map if you have meta
            this.$metaSubs = this.metaInteractor.getUserMetaObs().subscribe((meta: Meta) => {
                if (meta) {
                    const metaLastMapSelectedIndex = this.maps?.findIndex(_map => _map.id === meta.maps[0]?.id) ?? -1;
                    if (metaLastMapSelectedIndex !== -1) {
                        this.mapInteractor.setCurrentMap(this.maps[metaLastMapSelectedIndex]);
                    } else {
                        this.mapInteractor.setCurrentMap(this.maps[0]);
                    }
                } else {
                    this.mapInteractor.setCurrentMap(this.maps[0]);
                }
            });

            // 3. Socket connection with map selected
            this.gameInteractor.setCurrentGame(this.game);
            if (this.game?.mapsId) {
                this.gameStatus = this.game.status;
            }

            this.$getMouseObservableSubscription = this.mouseService.getMouseObservable().subscribe(mouse => {
                this.mouse = mouse;
            });
            this.$getSelectedKonvaObjectSubscription = this.mouseInteractor.getSelectedKonvaObjectObservable()
                .subscribe((selectedObject: CurrentSelectedKonvaObject[] | null) => {
                if (selectedObject) {
                    this.selectedKonvaObject = selectedObject[0];
                }
            });

            this.$getCurrentMapModificationSubs = this.mapInteractor.getCurrentMapModificationObs().subscribe((res) => {
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
        this.map = {...ev};
    }

    onSelectedMap(map: OurKonvaMap): void {
        // this.currentZoomOptions.value = 1;
        this.mapInteractor.setCurrentMap(map);
        this.socketService.sendMetaSelectedMap(map.id);
    }

    onCreateMap(map: OurKonvaMap): void {
        this.currentZoomOptions.scale = 1;
        this.mapInteractor.setCurrentMap(map);
        this.socketService.sendGameCreateMap(this.gameInteractor.getCurrentGame().id, map);
    }

    onDeleteMap(map: OurKonvaMap): void {
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
        if (this.currentMapMeta) {
            this.currentMapMeta.attrs = attrs;
        } else {
            const newMapAttrs = {id: this.mapInteractor.getCurrentMap().id, attrs};
            this.gameMeta.maps?.push(newMapAttrs);
        }
        this.socketService.sendMetaDragMap(this.mapInteractor.getCurrentMap().id, attrs);
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
        console.log('selectedActor->', actor);
        const newLayer: OurKonvaLayers = new OurKonvaLayers();
        const konvaObject = new OurKonvaObject(new Player());
        this.mouseInteractor.paintObjectOnMap(konvaObject, newLayer);
    }

    onDeleteActor(actor: Actor): void {
        this.libraryInteractor.deleteActor(actor);
    }

}
