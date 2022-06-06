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
export class MiniMapComponent implements AfterViewInit {

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

    initializeMap(): void {
        const stage = new Konva.Stage({
            container: 'mini-map-' + this.map?.id,
            width: 290,
            height: 170,
            draggable: false,
            scale: {x: 1, y: 1}
        });
        this.drawGrid();
        stage.add(this.layers.grid);
        stage.add(this.layers.objects);
        stage.add(this.layers.shadows);
        stage.add(this.layers.draws);
        stage.add(this.layers.texts);
        this.gridStage = stage;
    }

    async drawGrid(): Promise<void> {
        const gridGroup = new Konva.Group({
            id: 'gridGroup',
        });

        gridGroup.add(new Konva.Rect({
            x: 0,
            y: 0,
            draggable: false,
            width: 290,
            height: 170,
            id: 'grid-background',
            name: 'grid-background',
            fill: this.map.backgroundColor,
        }));

        try {
            if (this.map.backgroundImage) {
                await this.drawGridBackgroundImage(gridGroup);
            }

            this.layers.grid.add(gridGroup);
            this.layers?.grid?.cache();
        }
        catch (e) {
            console.log(e);
        }
    }

    drawGridBackgroundImage(gridGroup: Konva.Group): Promise<void> {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = this.map.backgroundImage.uri;
            image.onload = () => {
                gridGroup.add(new Konva.Rect({
                    x: 0,
                    y: 0,
                    draggable: false,
                    width: 290,
                    height: 170,
                    id: this.map.backgroundImage.id,
                    name: this.map.backgroundImage.name,
                    fillPatternImage: image,
                    fillPatternOffset: { x: 0, y: 0 },
                    fillPatternRepeat: 'no-repeat',
                    fillPatternScaleX: 290 / (this.map.nColumns * this.map.grid.cellSize),
                    fillPatternScaleY: 170 / (this.map.nRows * this.map.grid.cellSize),
                }));
                resolve();
            };

        });
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
