import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MouseService} from '../../services/mouse.service';

@Component({
    selector: 'app-editor-tools',
    templateUrl: './editor-tools.component.html',
    styleUrls: ['./editor-tools.component.scss']
})
export class EditorToolsComponent implements OnInit {

    currentToolSelected: string = 'cursor';

    constructor(private mouseService: MouseService) { }

    ngOnInit(): void {
    }

    onToolSelected(type: string): void {
        this.currentToolSelected = type;
        this.mouseService.setMouse(type);
    }

}
