import {Component, OnDestroy, OnInit} from '@angular/core';
import {GameInteractor} from '../../interactors/GameInteractor';
import {Game, GameStatus} from '../../classes/Game';
import {Page} from '../../classes/Page';
import {MouseService} from '../../services/mouse.service';
import {OurKonvaMap} from '../../classes/ourKonva/OurKonvaMap';
import {ApiService} from '../../services/api.service';
import {SocketService} from '../../services/socket.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {MouseInteractor} from '../../interactors/MouseInteractor';
import {CurrentSelectedKonvaObject} from '../../classes/ourKonva/OurKonvaMouse';
import {PageInteractor} from '../../interactors/PageInteractor';

@Component({
    selector: 'app-game-editor',
    templateUrl: './game-editor.component.html',
    styleUrls: ['./game-editor.component.scss']
})
export class GameEditorComponent implements OnInit, OnDestroy {
    map: OurKonvaMap;
    game: Game;
    gameStartStatus: GameStatus;
    selectedPage: Page = null;

    tabs: number = 0;
    currentObjectSelected: any;
    mouse: any;
    selectedKonvaObject: CurrentSelectedKonvaObject;

    gameSocketSubscription: Subscription;
    getMouseObservableSubscription: Subscription;
    getSelectedKonvaObjectSubscription: Subscription;
    getCurrentPageSubscription: Subscription;

    constructor(private gameInteractor: GameInteractor,
                private mouseInteractor: MouseInteractor,
                private pageInteractor: PageInteractor,
                private mouseService: MouseService,
                private apiService: ApiService,
                private socketService: SocketService,
                private router: ActivatedRoute) { }

    ngOnInit(): void {
        const gameId = this.router.snapshot.paramMap.get('id');
        this.socketService.sendGameEditorId(gameId);

        this.gameSocketSubscription = this.socketService.gameSocketSubscription.subscribe((socketGame: Game) => {
            this.game = socketGame;
            this.gameInteractor.setCurrentGame(this.game);
            if (this.game && this.game.pages) {
                this.pageInteractor.setCurrentPage(this.game.pages[0]);
                this.gameStartStatus = this.game.status;
            }
        });
        this.getMouseObservableSubscription = this.mouseService.getMouseObservable().subscribe(mouse => {
            this.mouse = mouse;
        });
        this.getSelectedKonvaObjectSubscription = this.mouseInteractor.getSelectedKonvaObjectObservable().subscribe(konva => {
            this.selectedKonvaObject = konva;
        });
        this.getCurrentPageSubscription = this.pageInteractor.getCurrentPageObs().subscribe((page: Page) => {
            this.selectedPage = page;
            if (this.selectedPage?.maps) {
                this.map = this.selectedPage.maps[0];
            }
        });
    }

    ngOnDestroy(): void {
        if (this.gameSocketSubscription) {
            this.socketService.gameSocketSubscription.unsubscribe();
        }
        if (this.getMouseObservableSubscription) {
            this.getMouseObservableSubscription.unsubscribe();
        }
        if (this.getSelectedKonvaObjectSubscription) {
            this.getSelectedKonvaObjectSubscription.unsubscribe();
        }
        if (this.getCurrentPageSubscription) {
            this.getCurrentPageSubscription.unsubscribe();
        }
    }

    updateProperties(ev): void {
        this.map = {...ev};
    }

    onSelectedPage(ev: Page): void {
        this.pageInteractor.setCurrentPage(ev);
    }

    onSelectedMap(ev: OurKonvaMap): void {
        // TODO donarli una altre volta
        this.onSetCurrentObjectSelected(ev);
    }

    onNewPage(page: Page): void {
        this.socketService.sendGameCreatePage(this.game.id, page);
    }

    onRenamePage(page: Page): void {
        this.socketService.sendGameRenamePage(this.game.id, page);
    }

    onRemovePage(page: Page): void {
        this.socketService.sendGameRemovePage(this.game.id, page);
    }

    onPagesChange(pages: Page[]): void {
        this.socketService.sendGamePagesUpdate(this.game.id, pages);
    }

    onNewMap(map: OurKonvaMap): void {
        this.socketService.sendGameCreateMap(this.selectedPage.id, map);
    }

    onRemoveMap(map: OurKonvaMap): void {
        this.socketService.sendGameRemoveMap(this.selectedPage.id, map);
    }

    onRenameMap(map: OurKonvaMap): void {
        this.socketService.sendGameRenameMap(this.selectedPage.id, map);
    }

    onMapMove(map: OurKonvaMap): void {
        this.socketService.sendGameMoveMap(map);
    }

    onSetCurrentObjectSelected(ev): void {
        this.currentObjectSelected = ev;
    }

    onMapsChange(maps: OurKonvaMap[]): void {
        this.socketService.sendGameMapsUpdate(this.game.id, this.selectedPage.id, maps);
    }

    onToPlayersMap(map: OurKonvaMap): void {
        this.socketService.sendGameSetToPlayersMap(this.game.id, this.selectedPage.id, map);
    }

    onToggleGameStatus(status: GameStatus): void {
        this.gameStartStatus = status;
        this.socketService.sendGameStartStatus(this.game.id, this.gameStartStatus);
    }

}
