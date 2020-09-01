import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MouseService} from '../../services/mouse.service';
import {Mouse, Cursor, Brush, MoveMap} from 'src/app/classes/Mouse';

@Component({
    selector: 'app-editor-tools',
    templateUrl: './editor-tools.component.html',
    styleUrls: ['./editor-tools.component.scss']
})
export class EditorToolsComponent implements OnInit {

    currentToolSelected: string = 'cursor';
    mouse: Mouse;

    constructor(private mouseService: MouseService) { }

    ngOnInit(): void {
        this.onToolSelected('cursor');
    }

    onToolSelected(type: string): void {
        this.currentToolSelected = type;
        switch (type) {
            case 'cursor':
                this.mouseService.setMouse(new Cursor());
                break;
            case 'moveMap':
                this.mouseService.setMouse(new MoveMap());
                break;
            case 'brush':
                this.mouseService.setMouse(new Brush());
                break;
            default:
                this.mouseService.setMouse(new Cursor());
                break;
        }
    }

}
