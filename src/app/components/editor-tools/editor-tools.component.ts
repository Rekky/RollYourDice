import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MouseService} from '../../services/mouse.service';
import {Mouse, Pointer, Brush, MoveMap, Text} from 'src/app/classes/Mouse';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-editor-tools',
    templateUrl: './editor-tools.component.html',
    styleUrls: ['./editor-tools.component.scss']
})
export class EditorToolsComponent implements OnInit, OnDestroy {

    currentToolSelected: string = 'cursor';
    getMouseObservableSubscription: Subscription;
    mouse: Mouse;

    constructor(private mouseService: MouseService) { }

    ngOnInit(): void {
        this.getMouseObservableSubscription = this.mouseService.getMouseObservable().subscribe((res) => {
            // this.mouse = res;
        });
        this.onToolSelected('cursor');
    }

    ngOnDestroy() {
        if (this.getMouseObservableSubscription) {
            this.getMouseObservableSubscription.unsubscribe();
        }
    }

    onToolSelected(type: string): void {
        this.currentToolSelected = type;
        switch (type) {
            case 'cursor':
                this.mouseService.setMouse(new Pointer());
                break;
            case 'moveMap':
                this.mouseService.setMouse(new MoveMap());
                break;
            case 'brush':
                this.mouseService.setMouse(new Brush());
                break;
            case 'text':
                this.mouseService.setMouse(new Text());
                break;
            default:
                this.mouseService.setMouse(new Pointer());
                break;
        }
    }

}
