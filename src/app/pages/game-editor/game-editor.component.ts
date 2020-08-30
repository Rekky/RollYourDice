import {Component, OnInit} from '@angular/core';
import {GameInteractor} from '../../interactors/GameInteractor';
import {Game} from '../../classes/Game';
import {Map} from '../../classes/Map';
import {Page} from '../../classes/Page';
import {MouseService} from '../../services/mouse.service';

@Component({
    selector: 'app-game-editor',
    templateUrl: './game-editor.component.html',
    styleUrls: ['./game-editor.component.scss']
})
export class GameEditorComponent implements OnInit {

    map: Map;
    game: Game;
    selectedPage: Page;

    tabs: number = 0;
    currentToolSelected: string = 'move';
    currentObjectSelected: any = {ev: null, object: null, type: null};

    constructor(private gameInteractor: GameInteractor, private mouseService: MouseService) { }

    ngOnInit(): void {
        const game: Game = this.gameInteractor.getGameEditor('123132123');
        this.game = game;
        this.selectedPage = this.game.pages.find((page) => page.id === this.game.selectedPageId);
    }

    onToolSelected(ev): void {
        this.currentToolSelected = ev;
        this.mouseService.setMouse(ev);

        switch (ev) {
            case 'text':
                console.log('es text');
                break;
            case 'draw-square':
                console.log('es draw square');
                break;
        }
    }

    updateProperties(ev): void {
        console.log('update', ev);
        this.map = {...ev};
    }

    onSelectedPage(ev: Page): void {
        /*if (ev..length > 0) {
            const mapFound = ev.find((layer) => layer.type === 'map');
            this.map = mapFound.content;
        } else {
            this.map = null;
        }*/
        this.map = ev.maps[0];
    }

    onSetCurrentObjectSelected(ev): void {
        this.currentObjectSelected = ev;
        console.log(this.currentObjectSelected);
    }

}
