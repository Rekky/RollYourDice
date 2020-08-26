import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Map} from '../../interfaces/Map';
import {Observable, of} from 'rxjs';
import Konva from 'konva';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild('map') canvasEl: ElementRef;
  @Input() map: Map = null;
  @Output() mapChange: EventEmitter<Map> = new EventEmitter<Map>();
  @Output() currentObjectSelected: EventEmitter<any> = new EventEmitter();
  @Input() currentToolSelected: string = null;

  _currentObjectSelected: any = null;
  private ctx: CanvasRenderingContext2D;
  private isDraggable: boolean = false;
  private startX: number;
  private startY: number;
  private offsetX: number = 0;
  private offsetY: number = 0;
  mapPositionX = window.innerWidth / 3;
  mapPositionY = 200;

  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
  mapWidth: number = 500;
  mapHeight: number = 500;

  flag = false;
  prevX = 0;
  currX = 0;
  prevY = 0;
  currY = 0;
  dotFlag = false;

  // KONVA LIB
  gridLayer: any = null;
  gridCellWidth: number = 90;

  // KONVA STAGES
  gridStage: any = null;

  constructor() { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    // this.ctx = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext('2d');
    this.canvasEl.nativeElement.addEventListener('mousemove', (e) => {
      if (this.currentToolSelected === 'move') {
        this.mapMove('mousemove', e);
      }
      if (this.currentToolSelected === 'draw') {
        this.findxy('mousemove', e);
      }
    }, false);
    this.canvasEl.nativeElement.addEventListener('mousedown', (e) => {
      if (this.currentToolSelected === 'move') {
        this.mapMove('mousedown', e);
      }
      if (this.currentToolSelected === 'draw') {
        this.findxy('mousedown', e);
      }
    }, false);
    this.canvasEl.nativeElement.addEventListener('mouseup', (e) => {
      if (this.currentToolSelected === 'move') {
        this.mapMove('mouseup', e);
      }
      if (this.currentToolSelected === 'draw') {
        this.findxy('mouseup', e);
      }
    }, false);
    this.canvasEl.nativeElement.addEventListener('mouseout', (e) => {
      this.findxy('out', e);
    }, false);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('entra en ngChanges');
    if (this.map != null) {
      this.gridCellWidth = this.map.cellWidth;
      setTimeout(() => {
        this.drawGrid();
        this.drawGridBackgroundImage();
        this.gridStage.add(this.gridLayer);
      });
    }
  }

  setCurrentObjectSelected(ev, object, type): void {
    ev.stopPropagation();

    if (this._currentObjectSelected !== null) {
      this._currentObjectSelected.ev.srcElement.style.border = '';
    }

    if (object !== null) {
      this._currentObjectSelected = {ev, object, type};
      this._currentObjectSelected.ev.srcElement.style.border = '2px solid rgb(91, 146, 226)';
    }

    this.currentObjectSelected.emit(this._currentObjectSelected);
  }

  drawGrid(): void {
    this.gridLayer = new Konva.Layer();
    this.gridStage = new Konva.Stage({
      container: 'map',
      width: this.mapWidth,
      height: this.mapHeight
    });

    for (let i = 0; i < this.mapWidth / this.gridCellWidth; i++) {
      this.gridLayer.add(new Konva.Line({
        points: [Math.round(i * this.gridCellWidth) + 0.5, 0, Math.round(i * this.gridCellWidth) + 0.5, this.mapHeight],
        stroke: '#ddd',
        strokeWidth: 1,
      }));
    }

    this.gridLayer.add(new Konva.Line({points: [0, 0, 10, 10]}));
    for (let j = 0; j < this.mapHeight / this.gridCellWidth; j++) {
      this.gridLayer.add(new Konva.Line({
        points: [0, Math.round(j * this.gridCellWidth), this.mapWidth, Math.round(j * this.gridCellWidth)],
        stroke: '#ddd',
        strokeWidth: 0.5,
      }));
    }
  }

  drawGridBackgroundImage(): void {
    const layer = new Konva.Layer();
    this.gridStage.add(layer);
    Konva.Image.fromURL('./../assets/backgrounds/CROSSING_THE_RIVER.jpg', (image) => {
      layer.add(image);
      image.setAttrs({
        x: 0,
        y: 0,
        width: this.mapWidth,
        height: this.mapHeight
      });
      image.cache();
      layer.draw();
    });
  }

  drawTextCanvas(): void {
    this.ctx.font = '30px Arial';
    this.ctx.fillStyle = 'red';
    this.ctx.fillText('Hello World', 10, 50);
  }

  /** --------- EVENTS FOR DRAW FREE ---------- */
  findxy(res, e): void {
    if (res === 'mousedown') {
      this.prevX = this.currX;
      this.prevY = this.currY;
      this.currX = e.clientX - this.canvasEl.nativeElement.offsetLeft;
      this.currY = e.clientY - this.canvasEl.nativeElement.offsetTop;

      this.flag = true;
      this.dotFlag = true;
      if (this.dotFlag) {
        this.ctx.beginPath();
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.currX, this.currY, 2, 2);
        this.ctx.closePath();
        this.dotFlag = false;
      }
    }
    if (res === 'mouseup' || res === 'mouseout') {
      this.flag = false;
    }
    if (res === 'mousemove') {
      if (this.flag) {
        this.prevX = this.currX;
        this.prevY = this.currY;
        this.currX = e.clientX - this.canvasEl.nativeElement.offsetLeft;
        this.currY = e.clientY - this.canvasEl.nativeElement.offsetTop;
        this.drawFreeWithMouse();
      }
    }
  }

  drawFreeWithMouse(): void {
    this.ctx.beginPath();
    this.ctx.moveTo(this.prevX, this.prevY);
    this.ctx.lineTo(this.currX, this.currY);
    this.ctx.strokeStyle = 'red';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.closePath();
  }

  /** --------- EVENTS FOR MOVE MAP ----------- */
  mapMove(res, ev: MouseEvent): void {
    if (res === 'mousedown') {
        this.isDraggable = true;
        this.startX = ev.clientX - this.offsetX;
        this.startY = ev.clientY - this.offsetY;
    }

    if (res === 'mousemove') {
      if (this.isDraggable) {
        this.mapPositionX = ev.clientX - this.startX;
        this.mapPositionY = ev.clientY - this.startY;
      }
      this.offsetX = this.mapPositionX;
      this.offsetY = this.mapPositionY;
    }

    if (res === 'mouseup') {
      this.isDraggable = false;
    }
  }

  setScale(ev): void {
    if (ev.deltaY < 0) {
      this.map.scale = this.map.scale + 0.1;
    } else {
      if (this.map.scale > 0.2 && this.map.scale > -0.1) {
        this.map.scale = this.map.scale - 0.1;
      }
    }
  }

}
