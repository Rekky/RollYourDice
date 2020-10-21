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
    selectedPage: Page = null;
    gameSocketSubscription: Subscription;

    tabs: number = 0;
    currentObjectSelected: any = {ev: null, object: null, type: null};

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
                this.selectedPage = this.game.pages.find((page: Page) => page.id === this.game.selectedPageId);
            }
        });
    }


    ngOnDestroy(): void {
        if (this.gameSocketSubscription) {
            this.socketService.gameSocketSubscription.unsubscribe();
        }
    }

    updateProperties(ev): void {
        console.log('updateProperties', ev);
        this.map = {...ev};
    }

    onSelectedPage(ev: Page): void {
        this.selectedPage = ev;
        if (ev.maps) {
            this.map = ev.maps[0];
        }
    }

    onSelectedMap(ev: OurKonvaMap): void {

    }

    onPageChange(ev: any): void {
        // this.socket.emit('game-editor', this.game);
    }

    onPagesChange(ev: Page[]): void {
        console.log('onPagesChange', this.game);
        this.socketService.sendGamePagesUpdate(this.game);
    }

    onSetCurrentObjectSelected(ev): void {
        this.currentObjectSelected = ev;
        console.log(this.currentObjectSelected);
    }

}
