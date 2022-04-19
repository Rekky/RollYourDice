import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-fill-color',
    templateUrl: './fill-color.component.html',
    styleUrls: ['./fill-color.component.scss']
})
export class FillColorComponent implements OnInit {
    @Input() color: string;
    @Output() colorChange: EventEmitter<string> = new EventEmitter<string>();
    isColorPickerFillDisplayed: boolean = false;

    constructor() { }

    ngOnInit(): void {
    }

    colorHasChanged(color: string): void {
        this.color = color;
        this.colorChange.emit(this.color);
    }

}

export interface RgbaColor {
    r: number;
    g: number;
    b: number;
    a: number;
}
