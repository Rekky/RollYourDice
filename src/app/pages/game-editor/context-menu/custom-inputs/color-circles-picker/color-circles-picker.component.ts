import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import {RgbaColor} from '../fill-color/fill-color.component';

@Component({
    selector: 'app-color-circles-picker',
    templateUrl: './color-circles-picker.component.html',
    styleUrls: ['./color-circles-picker.component.scss']
})
export class ColorCirclesPickerComponent implements OnInit {
    @Output() colorChange: EventEmitter<string> = new EventEmitter<string>();

    color: string = 'rgba(251, 113, 96, 1)';
    isNewColorPickerDisplayed: boolean = false;

    defaultColorValues: string[] = [
        'rgba(251, 113, 96, 1)',
        'rgba(255, 223, 171, 1)',
        'rgba(226, 242, 75, 1)',
        'rgba(144, 236, 136, 1)',
        'rgba(130, 242, 195, 1)',
        'rgba(136, 191, 236, 1)',
        'rgba(170, 136, 236, 1)',
        'rgba(231, 136, 236, 1)',
    ];

    constructor() {}

    ngOnInit(): void {
    }

    addColor(color: RgbaColor): void {
        this.color = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
        this.colorChange.emit(this.color);
    }

    colorHasChanged(color: string): void {
        this.color = color;
        this.colorChange.emit(this.color);
    }

}
