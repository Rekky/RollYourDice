import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-stroke-color',
    templateUrl: './stroke-input.component.html',
    styleUrls: ['./stroke-input.component.scss']
})
export class StrokeInputComponent implements OnInit {
    @Input() options: StrokeOptions;
    @Output() optionsChange: EventEmitter<StrokeOptions> = new EventEmitter<StrokeOptions>();
    isColorPickerStrokeDisplayed: boolean = false;

    constructor() { }

    ngOnInit(): void {
    }

    colorHasChanged(color: string): void {
        this.options.color = color;
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
