import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-fit-grid-input',
    templateUrl: './fit-grid-input.component.html',
    styleUrls: ['./fit-grid-input.component.scss']
})
export class FitGridInputComponent implements OnInit {
    @Input() isAdaptedToGrid: boolean;
    @Output() isAdaptedToGridChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() { }

    ngOnInit(): void {
    }

    toggleIsObjectAdaptedToGrid(): void {
        this.isAdaptedToGrid = !this.isAdaptedToGrid;
        this.isAdaptedToGridChange.emit(this.isAdaptedToGrid);
    }

}
