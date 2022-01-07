import {Component, OnDestroy, OnInit} from '@angular/core';
import {MouseService} from '../../../services/mouse.service';
import {OurKonvaBrush} from '../../../classes/ourKonva/OurKonvaBrush';
import {Subscription} from 'rxjs';
import {document} from 'ngx-bootstrap/utils';

@Component({
    selector: 'app-konva-brush-properties',
    templateUrl: './konva-brush-properties.component.html',
    styleUrls: ['./konva-brush-properties.component.scss']
})
export class KonvaBrushPropertiesComponent implements OnInit, OnDestroy {
    brush: OurKonvaBrush;
    getMouseObservableSubscription: Subscription;

    constructor(private mouseService: MouseService) { }

    ngOnInit(): void {
        this.getMouseObservableSubscription = this.mouseService.getMouseObservable().subscribe(mouse => {
            this.brush = mouse;
        });
    }

    ngOnDestroy(): void {
        if (this.getMouseObservableSubscription) {
            this.getMouseObservableSubscription.unsubscribe();
        }
    }

    colorModified(ev: string): void {
        this.brush.color = ev;
        this.mouseService.setMouse(this.brush);
    }

    sizeModified(ev: number): void {
        this.brush.brushSize = ev;
        this.mouseService.setMouse(this.brush);
    }
}
