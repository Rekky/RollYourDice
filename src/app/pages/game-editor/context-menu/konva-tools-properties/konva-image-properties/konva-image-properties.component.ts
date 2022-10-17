import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {OurKonvaRect} from '../../../../../classes/ourKonva/OurKonvaRect';
import {StrokeOptions} from '../../custom-inputs/stroke-input/stroke-input.component';
import {OurKonvaImage} from '../../../../../classes/ourKonva/OurKonvaImage';
import {CurrentSelectedKonvaObject} from '../../../../../classes/ourKonva/OurKonvaObject';

@Component({
  selector: 'app-konva-image-properties',
  templateUrl: './konva-image-properties.component.html',
  styleUrls: ['./konva-image-properties.component.scss']
})
export class KonvaImagePropertiesComponent implements OnInit {
    @Input() image: OurKonvaImage;
    @Output() imageChange: EventEmitter<OurKonvaImage> = new EventEmitter<OurKonvaImage>();
    @Output() isAdaptedToGridChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() isEditionBlockedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() isDisplayedJustForMasterChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() itemToTop: EventEmitter<void> = new EventEmitter<void>();
    @Output() itemToBottom: EventEmitter<void> = new EventEmitter<void>();

    constructor() { }

    ngOnInit(): void {
    }

    isAdaptedToGrid(ev: boolean): void {
        this.image.isAdaptedToGrid = ev;
        this.isAdaptedToGridChange.emit(ev);
    }

    isDisplayedJustForMaster(ev: boolean): void {
        this.isDisplayedJustForMasterChange.emit(ev);
    }

    isObjectEditionBlocked(ev: boolean): void {
        this.image.isEditionBlocked = ev;
        this.isEditionBlockedChange.emit(ev);
    }

    moveItemToTop(): void {
        this.itemToTop.emit();
    }

    moveItemToBottom(): void {
        this.itemToBottom.emit();
    }

}
