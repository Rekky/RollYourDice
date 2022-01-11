import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-tools-ux',
    templateUrl: './tools-ux.component.html',
    styleUrls: ['./tools-ux.component.scss']
})
export class ToolsUxComponent implements OnInit {

    @Input() blockOfTools: {name: string, displayed: boolean}[];
    @Input() currentToolSelected: any;
    @Input() toolDisplayed: boolean;

    constructor() { }

    ngOnInit(): void {
    }

    onToolSelected(a: any): void {

    }

}
