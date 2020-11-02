import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {OurKonvaMap} from '../../classes/ourKonva/OurKonvaMap';
import {OurKonvaMouse} from '../../classes/ourKonva/OurKonvaMouse';

@Component({
    selector: 'app-recursive-list',
    templateUrl: './recursive-list.component.html',
    styleUrls: ['./recursive-list.component.scss']
})
export class RecursiveListComponent implements OnInit, OnChanges {

    @Input() list = [];
    currentItem: OurKonvaMouse = null;


    constructor() {
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    onSelectItem(map: OurKonvaMouse): void {
        this.currentItem = map;
    }

}
