import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-bb-countdown',
  templateUrl: './bb-countdown.component.html',
  styleUrls: ['./bb-countdown.component.scss']
})
export class BbCountdownComponent implements OnInit {
    @Input() bb: any;

    constructor() { }

    ngOnInit(): void {}
}
