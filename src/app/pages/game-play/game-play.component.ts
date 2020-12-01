import { Component, OnInit } from '@angular/core';
import {Game} from '../../classes/Game';
import {ActivatedRoute} from '@angular/router';
import {SocketService} from '../../services/socket.service';
import {Subscription} from 'rxjs';
import {OurKonvaMap} from '../../classes/ourKonva/OurKonvaMap';

@Component({
    selector: 'app-game-play',
    templateUrl: './game-play.component.html',
    styleUrls: ['./game-play.component.scss']
})
export class GamePlayComponent implements OnInit {

    gameSocketSubscription: Subscription;
    map: OurKonvaMap;

    constructor(private socketService: SocketService, private router: ActivatedRoute) { }

    ngOnInit(): void {
        const gameId = this.router.snapshot.paramMap.get('id');
        this.socketService.sendGamePlayId(gameId);
        // this.gameSocketSubscription = this.socketService.gameSocketSubscription.subscribe((socketGame: Game) => {
        //     const game = socketGame;
        //     console.log('game', game);
        //     if (game && game.pages) {
        //         this.map = game.pages[0].maps[0];
        //     }
        // });
        this.socketService.socket.on('game-play-load', (data) => {
            console.log('RECIBO_GAMEPLAY', data);
            console.log(data);
            this.map = data;
        });
    }

}
