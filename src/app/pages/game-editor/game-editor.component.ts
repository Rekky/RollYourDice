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
    selectedPage: Page = null;

    tabs: number = 0;
    currentObjectSelected: any = {ev: null, object: null, type: null};

    constructor(private gameInteractor: GameInteractor,
                private mouseService: MouseService) { }

    ngOnInit(): void {
        this.game = this.gameInteractor.getGameEditor('123132123');
        this.selectedPage = this.game.pages.find((page: Page) => page.id === this.game.selectedPageId);
    }

    updateProperties(ev): void {
        console.log('update', ev);
        this.map = {...ev};
    }

    onSelectedPage(ev: Page): void {
        console.log('onSelectedPage', ev);
        this.selectedPage = ev;
        if (ev.maps) {
            this.map = ev.maps[0];
        }
    }

    onSelectedMap(ev: Map): void {

    }

    onSetCurrentObjectSelected(ev): void {
        this.currentObjectSelected = ev;
        console.log(this.currentObjectSelected);
    }

}
