import {Component, OnInit} from '@angular/core';
import {GameInteractor} from '../../interactors/GameInteractor';
import {Game} from '../../classes/Game';
import {Page} from '../../classes/Page';
import {MouseService} from '../../services/mouse.service';
import {OurKonvaMap} from '../../classes/ourKonva/OurKonvaMap';
import io from 'socket.io-client';
import {ApiService} from '../../services/api.service';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'app-game-editor',
    templateUrl: './game-editor.component.html',
    styleUrls: ['./game-editor.component.scss']
})
export class GameEditorComponent implements OnInit {

    map: OurKonvaMap;
    game: Game;
    selectedPage: Page = null;
    gameSubscription: BehaviorSubject<Game> = new BehaviorSubject<Game>(null);

    tabs: number = 0;
    currentObjectSelected: any = {ev: null, object: null, type: null};

    // Socket io
    socket = io(this.apiService.API_URL);

    constructor(private gameInteractor: GameInteractor,
                private mouseService: MouseService,
                private apiService: ApiService) { }

    ngOnInit(): void {
        this.socket.on('connect', () => {
            console.log('conectado al socket correctamente');
        });
        this.socket.on('game-editor', (data) => {
            console.log('msg recibido', data);
            this.gameSubscription.next(data);
            this.selectedPage = this.game.pages.find((page: Page) => page.id === this.game.selectedPageId);
        });
        this.socket.on('disconnect', () => {
            console.log('socket desconectado!');
        });
        // subscription del game
        this.gameSubscription.subscribe((game: Game) => {
            this.game = game;
            console.log(this.game);
        });
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
        this.socket.emit('game-editor', this.game);
    }

    onSetCurrentObjectSelected(ev): void {
        this.currentObjectSelected = ev;
        console.log(this.currentObjectSelected);
    }

}
