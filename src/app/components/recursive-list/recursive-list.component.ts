import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {OurKonvaMap} from '../../classes/ourKonva/OurKonvaMap';
import {OurKonvaMouse} from '../../classes/ourKonva/OurKonvaMouse';
import {MouseInteractor} from '../../interactors/MouseInteractor';
import Konva from 'konva';

@Component({
    selector: 'app-recursive-list',
    templateUrl: './recursive-list.component.html',
    styleUrls: ['./recursive-list.component.scss']
})
export class RecursiveListComponent implements OnInit, OnChanges {

    @Input() list = [];
    currentItem: OurKonvaMouse = null;

    constructor(private mouseInteractor: MouseInteractor) {
    }

    ngOnInit(): void {
        console.log('list =', this.list);
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    onSelectItem(item: any): void {
        // this.mouseInteractor.setSelectedKonvaObject(item);
        this.mouseInteractor.clickMapObject(item);
    }

}
