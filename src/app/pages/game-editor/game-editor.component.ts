import {Component, OnDestroy, OnInit} from '@angular/core';
import {GameInteractor} from '../../interactors/GameInteractor';
import {Game} from '../../classes/Game';
import {Page} from '../../classes/Page';
import {MouseService} from '../../services/mouse.service';
import {OurKonvaMap} from '../../classes/ourKonva/OurKonvaMap';
import {ApiService} from '../../services/api.service';
import {SocketService} from '../../services/socket.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-game-editor',
    templateUrl: './game-editor.component.html',
    styleUrls: ['./game-editor.component.scss']
})
export class GameEditorComponent implements OnInit, OnDestroy {
    map: OurKonvaMap;
    game: Game;
    gameStartStatus: boolean = false;
    selectedPage: Page = null;

    tabs: number = 0;
    currentObjectSelected: any;
    mouse: any;

    gameSocketSubscription: Subscription;
    getMouseObservableSubscription: Subscription;

    constructor(private gameInteractor: GameInteractor,
                private mouseService: MouseService,
                private apiService: ApiService,
                private socketService: SocketService,
                private router: ActivatedRoute) { }

    ngOnInit(): void {
        const gameId = this.router.snapshot.paramMap.get('id');
        this.socketService.sendGameEditorId(gameId);

        // me subscribo al game que me llega del socket
        this.gameSocketSubscription = this.socketService.gameSocketSubscription.subscribe((socketGame: Game) => {
            this.game = socketGame;
            if (this.game && this.game.pages) {
                // this.selectedPage = this.game.pages.find((page: Page) => page.id === this.game.selectedPageId);
                this.selectedPage = this.game.pages.length > 0 ? this.game.pages[0] : null;
                this.gameStartStatus = this.game.gameStatus;
            }
        });

        this.getMouseObservableSubscription = this.mouseService.getMouseObservable().subscribe(mouse => {
            this.mouse = mouse;
        });
    }

    ngOnDestroy(): void {
        if (this.gameSocketSubscription) {
            this.socketService.gameSocketSubscription.unsubscribe();
        }
        if (this.getMouseObservableSubscription) {
            this.getMouseObservableSubscription.unsubscribe();
        }
    }

    updateProperties(ev): void {
        this.map = {...ev};
    }

    onSelectedPage(ev: Page): void {
        this.selectedPage = ev;
        if (ev.maps) {
            this.map = ev.maps[0];
        }
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

    onStartGame(): void {
        this.gameStartStatus = !this.gameStartStatus;
        this.socketService.sendGameStartStatus(this.game.id, this.gameStartStatus);
    }

}
