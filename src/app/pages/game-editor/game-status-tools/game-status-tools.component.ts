import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GameStatus } from 'src/app/classes/Game';

@Component({
  selector: 'app-game-status-tools',
  templateUrl: './game-status-tools.component.html',
  styleUrls: ['./game-status-tools.component.scss']
})
export class GameStatusToolsComponent implements OnInit {

  @Input() status = null; //play=0, pause=1, stop=2
  @Output() statusChange: EventEmitter<number> = new EventEmitter<number>();
  @Input() mapName: string = null;
  GameStatus = GameStatus;

  constructor() { }

  ngOnInit(): void {

  }

  selectStatus(status: GameStatus): void {
    if(status === this.status) {
      return;
    }
    this.status = status;
    this.statusChange.emit(this.status);
  }

}
