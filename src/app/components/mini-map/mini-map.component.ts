import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {OurKonvaMap} from '../../classes/ourKonva/OurKonvaMap';
import Konva from 'konva';
import {OurKonvaLayers} from '../../classes/ourKonva/OurKonvaLayers';
import {OurKonvaRect} from '../../classes/ourKonva/OurKonvaRect';
import {OurKonvaText} from '../../classes/ourKonva/OurKonvaText';
import {OurKonvaImage} from '../../classes/ourKonva/OurKonvaImage';
import {OurKonvaBrush} from '../../classes/ourKonva/OurKonvaBrush';

@Component({
    selector: 'app-mini-map',
    templateUrl: './mini-map.component.html',
    styleUrls: ['./mini-map.component.scss']
})
export class MiniMapComponent implements OnInit, AfterViewInit {

    @ViewChild('mapEl') mapEl: ElementRef;
    @Input() map: OurKonvaMap;
    protected layers: OurKonvaLayers = new OurKonvaLayers();
    protected gridStage: Konva.Stage;

    constructor() {
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.initializeMap();
            this.paintObjectsOnMap(this.map.objects, this.layers);
        }, 100);
    }

    ngOnInit(): void {

    }

    initializeMap(): void {
        const stage = new Konva.Stage({
            container: 'mini-map-' + this.map?.id,
            width: 290,
            height: 170,
            draggable: false,
            scale: {x: 0.15, y: 0.15}
        });
        stage.container().style.backgroundColor = '#f2f2f2';
        this.drawGrid();
        stage.add(this.layers.grid);
        stage.add(this.layers.objects);
        stage.add(this.layers.shadows);
        stage.add(this.layers.draws);
        stage.add(this.layers.texts);
        this.gridStage = stage;
    }

    drawGrid(): void {
        for (let i = 0; i <= this.map.nColumns; i++) {
            this.layers.grid.add(new Konva.Line({
                points: [
                    Math.round(i * this.map.grid.cellSize) + 0.5,
                    0,
                    Math.round(i * this.map.grid.cellSize) + 0.5,
                    this.map.nRows * this.map.grid.cellSize
                ],
                stroke: '#e6e6e6',
                strokeWidth: 1,
            }));
        }

        this.layers.grid.add(new Konva.Line({
            points: [0, 0, 10, 10]
        }));
        for (let j = 0; j <= this.map.nRows; j++) {
            this.layers.grid.add(new Konva.Line({
                points: [
                    0,
                    Math.round(j * this.map.grid.cellSize),
                    this.map.nColumns * this.map.grid.cellSize,
                    Math.round(j * this.map.grid.cellSize)
                ],
                stroke: '#e6e6e6',
                strokeWidth: 1,
            }));
        }
        this.layers?.grid?.cache();
    }

    paintObjectsOnMap(objects: any, layers: OurKonvaLayers): void {
        objects.forEach((object: any) => {
            this.paintObjectOnMap(object, layers);
        });
    }

    paintObjectOnMap(object: any, layers: OurKonvaLayers): void {
        if (object?.state === 'square') {
            OurKonvaRect.paint(object, layers);
        }
        if (object?.state === 'text') {
            OurKonvaText.paint(object, layers);
        }
        if (object?.state === 'image') {
            OurKonvaImage.paint(object, layers);
        }
        if (object?.state === 'brush') {
            OurKonvaBrush.paint(object, layers);
        }
    }

}
