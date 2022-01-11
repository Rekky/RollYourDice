import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-tools-ux',
    templateUrl: './tools-ux.component.html',
    styleUrls: ['./tools-ux.component.scss']
})
export class ToolsUxComponent implements OnInit {

    @Input() blockOfTools: {name: string, displayed: boolean}[];
    @Input() currentToolSelected: string;
    @Input() toolDisplayed: boolean;
    @Output() toolSelected: EventEmitter<string> = new EventEmitter<string>();
    @Output() updateImage: EventEmitter<File> = new EventEmitter<File>();

    constructor() { }

    ngOnInit(): void {
    }

    onToolSelected(tool: string): void {
        this.toolSelected.emit(tool);
    }

    onUpdateImage(file: File): void {
        this.updateImage.emit(file);
    }

}
