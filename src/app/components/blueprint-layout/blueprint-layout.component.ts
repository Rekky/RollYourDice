import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import Konva from 'konva';

@Component({
    selector: 'app-blueprint-layout',
    templateUrl: './blueprint-layout.component.html',
    styleUrls: ['./blueprint-layout.component.scss']
})
export class BlueprintLayoutComponent implements OnInit, AfterViewInit {
    @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() { }

    ngOnInit(): void {
        window.addEventListener('resize', () => {
            // this.gridStage.width(window.innerWidth);
            // this.gridStage.height(window.innerHeight);
            this.initBlueprint();
            // this.gridStage.batchDraw();
        });
    }

    ngAfterViewInit(): void {
        this.initBlueprint();
    }

    initBlueprint(): void {
        const stage = new Konva.Stage({
            container: 'blueprint',
            width: window.innerWidth,
            height: window.innerHeight,
            draggable: true
        });

        const layer = new Konva.Layer();
        stage.add(layer);


        const WIDTH = 75;
        const HEIGHT = 75;

        const grid = [
            ['transparent', 'transparent'],
            ['transparent', 'transparent']
        ];

        this.checkShapes(stage, WIDTH, HEIGHT, grid, layer);
        layer.cache();
        layer.batchDraw();

        stage.on('dragend', () => {
            layer.clearCache();
            layer.destroyChildren();
            this.checkShapes(stage, WIDTH, HEIGHT, grid, layer);
            layer.cache();
            layer.batchDraw();
        });
    }

    checkShapes(stage, WIDTH, HEIGHT, grid, layer): void {
        const startX = Math.floor((-stage.x() - stage.width()) / WIDTH) * WIDTH;
        const endX = Math.floor((-stage.x() + stage.width() * 2) / WIDTH) * WIDTH;

        const startY = Math.floor((-stage.y() - stage.height()) / HEIGHT) * HEIGHT;
        const endY = Math.floor((-stage.y() + stage.height() * 2) / HEIGHT) * HEIGHT;

        for (let x = startX; x < endX; x += WIDTH) {
            for (let y = startY; y < endY; y += HEIGHT) {
                const indexX = ((x / WIDTH) + grid.length * WIDTH) % grid.length;
                const indexY = ((y / HEIGHT) + grid[0].length * HEIGHT) % grid[0].length;

                //maps from 0 to 3
                const i = indexX * 2 + indexY;

                layer.add(new Konva.Rect({
                    x,
                    y,
                    width: WIDTH,
                    height: HEIGHT,
                    fill: '#050011',
                    stroke: '#030025',
                    strokeWidth: 1,
                    opacity: 1,
                    cornerRadius: 5,
                }));
            }
        }

    }

    closeBlueprint(): void {
        this.close.emit(true);
    }
}
