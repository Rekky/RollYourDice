import {Component, OnDestroy, OnInit} from '@angular/core';
import {Game} from '../../classes/Game';
import {Page} from '../../classes/Page';
import {SocketService} from '../../services/socket.service';
import {Subscription} from 'rxjs';
import {OurKonvaMap} from '../../classes/ourKonva/OurKonvaMap';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-players-game',
    templateUrl: './players-game.component.html',
    styleUrls: ['./players-game.component.scss']
})
export class PlayersGameComponent implements OnInit, OnDestroy {
    gameSocketSubscription: Subscription;
    map: OurKonvaMap;

    constructor(private socketService: SocketService,
                private router: ActivatedRoute) { }

    ngOnInit(): void {
        const gameId = this.router.snapshot.paramMap.get('id');
        this.socketService.sendGameEditorId(gameId);
        this.gameSocketSubscription = this.socketService.gameSocketSubscription.subscribe((socketGame: Game) => {
            const game = socketGame;
            console.log('game =', game);
            if (game && game.pages) {
                // this.selectedPage = this.game.pages.find((page: Page) => page.id === this.game.selectedPageId);
                this.map = game.pages[0].maps[0];
            }
        });
    }

    ngOnDestroy(): void {
        if (this.gameSocketSubscription) {
            this.socketService.gameSocketSubscription.unsubscribe();
        }
    }
}
