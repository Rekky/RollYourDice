import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-number-input',
    templateUrl: './number-input.component.html',
    styleUrls: ['./number-input.component.scss']
})
export class NumberInputComponent implements OnInit {
    @Input() nValue: number;
    @Output() nValueChange: EventEmitter<number> = new EventEmitter<number>();

    currentValue: number;

    constructor() { }

    ngOnInit(): void {
        this.currentValue = this.nValue;
    }

    changeValue(): void {
        if (this.nValue === this.currentValue) {
            return;
        }
        this.nValue = this.currentValue;
        this.nValueChange.emit(this.nValue);
    }

}
