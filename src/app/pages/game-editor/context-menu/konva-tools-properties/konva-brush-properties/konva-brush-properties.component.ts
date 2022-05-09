import {Component, OnDestroy, OnInit} from '@angular/core';
import {MouseService} from '../../../../../services/mouse.service';
import {OurKonvaBrush} from '../../../../../classes/ourKonva/OurKonvaBrush';
import {Subscription} from 'rxjs';
import {document} from 'ngx-bootstrap/utils';

@Component({
    selector: 'app-konva-brush-properties',
    templateUrl: './konva-brush-properties.component.html',
    styleUrls: ['./konva-brush-properties.component.scss']
})
export class KonvaBrushPropertiesComponent implements OnInit, OnDestroy {

    constructor(private mouseService: MouseService) { }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }
}
