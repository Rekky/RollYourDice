import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {OurKonvaBrush} from '../../../../../classes/ourKonva/OurKonvaBrush';

@Component({
    selector: 'app-konva-brush-properties',
    templateUrl: './konva-brush-properties.component.html',
    styleUrls: ['./konva-brush-properties.component.scss']
})
export class KonvaBrushPropertiesComponent implements OnInit {
    @Input() brush: OurKonvaBrush;
    @Output() brushChange: EventEmitter<OurKonvaBrush> = new EventEmitter<OurKonvaBrush>();
    @Output() isEditionBlockedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() { }

    ngOnInit(): void {
    }

    fillColorModified(ev: string): void {
        this.brush.color = ev;
        this.brushChange.emit(this.brush);
    }

    isObjectEditionBlocked(ev: boolean): void {
        this.brush.isEditionBlocked = ev;
        this.isEditionBlockedChange.emit(ev);
    }
}
