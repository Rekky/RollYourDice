import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MouseService} from '../../../services/mouse.service';
import {OurKonvaRect} from '../../../classes/ourKonva/OurKonvaRect';

@Component({
  selector: 'app-konva-rectangle-properties',
  templateUrl: './konva-rectangle-properties.component.html',
  styleUrls: ['./konva-rectangle-properties.component.scss']
})
export class KonvaRectanglePropertiesComponent implements OnInit, OnDestroy {
    rectangle: OurKonvaRect;
    getMouseObservableSubscription: Subscription;

    constructor(private mouseService: MouseService) { }

    ngOnInit(): void {
        this.getMouseObservableSubscription = this.mouseService.getMouseObservable().subscribe(mouse => {
            this.rectangle = mouse;
        });
    }

    ngOnDestroy(): void {
        if (this.getMouseObservableSubscription) {
            this.getMouseObservableSubscription.unsubscribe();
        }
    }

    fillColorModified(ev: string): void {
        this.rectangle.fillColor = ev;
        this.mouseService.setMouse(this.rectangle);
    }

    sizeModified(ev: number): void {
        this.rectangle.strokeSize = ev;
        this.mouseService.setMouse(this.rectangle);
    }

    strokeColorModified(ev: string): void {
        this.rectangle.strokeColor = ev;
        this.mouseService.setMouse(this.rectangle);
    }

    opacityModified(ev: number): void {
        this.rectangle.opacity = ev;
        this.mouseService.setMouse(this.rectangle);
    }
}
