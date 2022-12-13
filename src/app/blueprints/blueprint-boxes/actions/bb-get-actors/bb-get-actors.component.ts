import {Component, Input, OnInit} from '@angular/core';
import {ActorTypesEnum} from '../../../../classes/Actor';

@Component({
  selector: 'app-bb-get-actors',
  templateUrl: './bb-get-actors.component.html',
  styleUrls: ['./bb-get-actors.component.scss']
})
export class BbGetActorsComponent implements OnInit {
    @Input() bb: any;
    typeOptions = ActorTypesEnum;

    constructor() { }

    ngOnInit(): void {}
}
