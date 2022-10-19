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
    @Input() stage: any;

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
            width: 292,
            height: 165,
            draggable: false,
            scale: {x: 0.2, y: 0.2}
        });
        stage.container().style.backgroundColor = '#f2f2f2';
        stage.add(this.layers.background);
        stage.add(this.layers.grid);
        stage.add(this.layers.objects);
        stage.add(this.layers.draws);
        stage.add(this.layers.texts);
        this.gridStage = stage;

        // const cloned_stage = this.stage.clone();
        // cloned_stage.setContainer('mini-map-' + this.map?.id);
        // cloned_stage.draw();
    }

    // drawGridBackgroundImage(gridGroup: Konva.Group): Promise<void> {
    //     return new Promise((resolve, reject) => {
    //         const image = new Image();
    //         image.src = this.map.backgroundImage.uri;
    //         image.onload = () => {
    //             gridGroup.add(new Konva.Rect({
    //                 x: 0,
    //                 y: 0,
    //                 draggable: false,
    //                 width: 290,
    //                 height: 170,
    //                 id: this.map.backgroundImage.id,
    //                 name: this.map.backgroundImage.name,
    //                 fillPatternImage: image,
    //                 fillPatternOffset: { x: 0, y: 0 },
    //                 fillPatternRepeat: 'no-repeat',
    //                 fillPatternScaleX: 290 / (this.map.nColumns * this.map.grid.cellSize),
    //                 fillPatternScaleY: 170 / (this.map.nRows * this.map.grid.cellSize),
    //             }));
    //             resolve();
    //         };
    //
    //     });
    // }

    paintObjectsOnMap(objects: any, layers: OurKonvaLayers): void {
        objects.forEach((object: any) => {
            this.paintObjectOnMap(object, layers);
        });
    }

    paintObjectOnMap(object: any, layers: OurKonvaLayers): void {
        if (object?.state === 'square') {
            OurKonvaRect.paint(object, layers.draws);
        }
        if (object?.state === 'text') {
            OurKonvaText.paint(object, layers.texts);
        }
        if (object?.state === 'image') {
            OurKonvaImage.paint(object, layers.draws);
        }
        if (object?.state === 'brush') {
            OurKonvaBrush.paint(object, layers.draws);
        }
    }

}
