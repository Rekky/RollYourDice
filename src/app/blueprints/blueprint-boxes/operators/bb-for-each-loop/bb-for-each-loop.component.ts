import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-bb-for-each-loop',
  templateUrl: './bb-for-each-loop.component.html',
  styleUrls: ['./bb-for-each-loop.component.scss']
})
export class BbForEachLoopComponent implements OnInit {
    @Input() bb: any;

    constructor() { }

    ngOnInit(): void {}
}
