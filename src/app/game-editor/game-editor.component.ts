import {Component, OnInit} from '@angular/core';
import {EditorObjectSelected, Map} from '../interfaces/Map';
import {ApiService} from '../services/api.service';
import {Game, Page} from '../interfaces/Game';

@Component({
  selector: 'app-game-editor',
  templateUrl: './game-editor.component.html',
  styleUrls: ['./game-editor.component.scss']
})
export class GameEditorComponent implements OnInit {

  map: Map = null;
  game: Game = null;

  tabs: number = 0;
  currentToolSelected: string = 'move';
  currentObjectSelected: EditorObjectSelected = {ev: null, object: null, type: null};

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.game = this.apiService.getGameEditor();

  }

  onToolSelected(ev): void {
    console.log(ev);
    this.currentToolSelected = ev;

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
    if (ev.layers.length > 0) {
      const mapFound = ev.layers.find((layer) => layer.type === 'map');
      this.map = mapFound.content;
    } else {
      this.map = null;
    }
  }

  onSetCurrentObjectSelected(ev): void {
    this.currentObjectSelected = ev;
    console.log(this.currentObjectSelected);
  }

}
