import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-fill-color',
    templateUrl: './fill-color.component.html',
    styleUrls: ['./fill-color.component.scss']
})
export class FillColorComponent implements OnInit {
    @Input() color: string;
    @Output() colorChange: EventEmitter<string> = new EventEmitter<string>();
    isColorPickerDisplayed: boolean = false;

    constructor() { }

    ngOnInit(): void {
    }

    changeComplete(color: RgbaColor): void {
        this.color = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
        this.colorChange.emit(this.color);
    }

}

export interface RgbaColor {
    r: number;
    g: number;
    b: number;
    a: number;
}
