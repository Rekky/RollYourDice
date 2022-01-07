import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MouseService} from '../../../services/mouse.service';
import {OurKonvaEraser} from '../../../classes/ourKonva/OurKonvaEraser';

@Component({
    selector: 'app-konva-eraser-properties',
    templateUrl: './konva-eraser-properties.component.html',
    styleUrls: ['./konva-eraser-properties.component.scss']
})
export class KonvaEraserPropertiesComponent implements OnInit, OnDestroy {
    eraser: OurKonvaEraser;
    getMouseObservableSubscription: Subscription;

    constructor(private mouseService: MouseService) { }

    ngOnInit(): void {
        this.getMouseObservableSubscription = this.mouseService.getMouseObservable().subscribe(mouse => {
            this.eraser = mouse;
        });
    }

    ngOnDestroy(): void {
        if (this.getMouseObservableSubscription) {
            this.getMouseObservableSubscription.unsubscribe();
        }
    }

    sizeModified(ev: number): void {
        this.eraser.brushSize = ev;
        this.mouseService.setMouse(this.eraser);
    }
}
