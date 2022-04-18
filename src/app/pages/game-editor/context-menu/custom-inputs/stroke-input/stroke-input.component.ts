import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RgbaColor} from '../fill-color/fill-color.component';

@Component({
    selector: 'app-stroke-color',
    templateUrl: './stroke-input.component.html',
    styleUrls: ['./stroke-input.component.scss']
})
export class StrokeInputComponent implements OnInit {
    @Input() options: StrokeOptions;
    @Output() optionsChange: EventEmitter<StrokeOptions> = new EventEmitter<StrokeOptions>();
    isColorPickerDisplayed: boolean = false;

    constructor() { }

    ngOnInit(): void {
    }

    colorHasChanged(color: RgbaColor): void {
        this.options.color = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
        this.optionsChange.emit(this.options);
    }

    strokeWidthHasChanged(width: number): void {
        this.options.width = width;
        this.optionsChange.emit(this.options);
    }
}

export interface StrokeOptions {
    color: string;
    width: number;
}
