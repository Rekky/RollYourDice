import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-assets-list-tools',
    templateUrl: './assets-list-tools.component.html',
    styleUrls: ['./assets-list-tools.component.scss']
})
export class AssetsListToolsComponent implements OnInit {

    @Input() assets: any = [];
    @Output() assetsChange: EventEmitter<any> = new EventEmitter();
    @Input() selectedAssets: any = [];
    @Output() selectedAssetsChange: EventEmitter<any> = new EventEmitter();

    constructor() {
    }

    ngOnInit(): void {
    }

}
