import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RgbaColor} from '../fill-color/fill-color.component';

@Component({
    selector: 'app-stroke-color',
    templateUrl: './stroke-color.component.html',
    styleUrls: ['./stroke-color.component.scss']
})
export class StrokeColorComponent implements OnInit {
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
