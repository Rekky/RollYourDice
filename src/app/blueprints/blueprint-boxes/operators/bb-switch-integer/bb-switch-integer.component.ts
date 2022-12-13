import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-bb-switch-integer',
  templateUrl: './bb-switch-integer.component.html',
  styleUrls: ['./bb-switch-integer.component.scss']
})
export class BbSwitchIntegerComponent implements OnInit {
    @Input() bb: any;
    @Output() addNodeOut: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit(): void {}

    addOutNode(): void {
        this.addNodeOut.emit();
    }
}
