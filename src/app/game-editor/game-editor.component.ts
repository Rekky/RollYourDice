import {Component, OnInit} from '@angular/core';
import {Map} from '../interfaces/Map';
import {ApiService} from '../services/api.service';

@Component({
  selector: 'app-game-editor',
  templateUrl: './game-editor.component.html',
  styleUrls: ['./game-editor.component.scss']
})
export class GameEditorComponent implements OnInit {

  map: Map = null;
  tabs: number = 0;
  currentToolSelected: string = 'move';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.map = this.apiService.getMap();
  }

  onToolSelected(ev): void {
    console.log(ev);
    this.currentToolSelected = ev;

    switch (ev) {
      case 'text':
        // this.drawTextCanvas();
        break;
      case 'draw-square':
        console.log('es draw square');
        break;
    }
  }

  updateProperties(ev): void {
    console.log('update', ev);
  }

}
