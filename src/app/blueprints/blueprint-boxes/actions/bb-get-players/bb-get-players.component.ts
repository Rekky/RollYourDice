import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-bb-get-players',
  templateUrl: './bb-get-players.component.html',
  styleUrls: ['./bb-get-players.component.scss']
})
export class BbGetPlayersComponent implements OnInit {
    @Input() bb: any;

    constructor() { }

    ngOnInit(): void {}
}
