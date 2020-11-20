import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MouseService} from '../../../services/mouse.service';
import {OurKonvaText} from '../../../classes/ourKonva/OurKonvaText';

@Component({
    selector: 'app-konva-text-properties',
    templateUrl: './konva-text-properties.component.html',
    styleUrls: ['./konva-text-properties.component.scss']
})
export class KonvaTextPropertiesComponent implements OnInit, OnDestroy {
    text: OurKonvaText;
    getMouseObservableSubscription: Subscription;

    constructor(private mouseService: MouseService) { }

    ngOnInit(): void {
        this.getMouseObservableSubscription = this.mouseService.getMouseObservable().subscribe(mouse => {
            this.text = mouse;
        });
    }

    ngOnDestroy(): void {
        if (this.getMouseObservableSubscription) {
            this.getMouseObservableSubscription.unsubscribe();
        }
    }

    colorModified(ev: string): void {
        this.text.color = ev;
        this.mouseService.setMouse(this.text);
    }

    sizeModified(ev: number): void {
        this.text.fontSize = ev;
        this.mouseService.setMouse(this.text);
    }
}
