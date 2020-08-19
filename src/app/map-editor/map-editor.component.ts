import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import { Map } from '../interfaces/Map';

@Component({
  selector: 'app-map-editor',
  templateUrl: './map-editor.component.html',
  styleUrls: ['./map-editor.component.scss']
})
export class MapEditorComponent implements OnInit, AfterViewInit {

  @ViewChild('mapEl') canvasEl: ElementRef;
  map: Map = {columns: 800, rows: 800, scale: 1};
  currentObjectSelected: any = null;

  private context: CanvasRenderingContext2D;
  private isDraggable: boolean = false;
  private startX: number;
  private startY: number;
  private offsetX: number = 0;
  private offsetY: number = 0;
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
  mapPositionX = window.innerWidth / 4;
  mapPositionY = 200;
  mapWidth: number = window.innerWidth;
  mapHeight: number = window.innerHeight;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth = event.target.innerWidth;
    this.screenHeight = event.target.innerHeight;
  }

  constructor() { }


  ngOnInit(): void {
    console.log(window.innerWidth);
  }

  ngAfterViewInit(): void {
    this.context = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext('2d');
    this.drawGrid(80, 5);
  }

  setCurrentObjectSelected(ev, object): void {
    ev.stopPropagation();
    this.currentObjectSelected = object;
  }

  updateMap(ev): void {
    console.log('update', ev);
    this.context.clearRect(0, 0, this.map.columns, this.map.rows);
    // this.drawGrid(80, 50);
  }

  drawGrid(columns: number, rows: number): void {
    const boxSize = 70;
    const boxes = Math.floor(this.mapWidth / boxSize);

    this.context.beginPath();
    this.context.fillStyle = 'white';
    this.context.lineWidth = 2;
    this.context.strokeStyle = 'black';
    for (let row = 0; row < boxes; row++) {
      for (let column = 0; column < boxes; column++) {
        const x = column * boxSize;
        const y = row * boxSize;
        this.context.rect(x, y, boxSize, boxSize);
        this.context.fill();
        this.context.stroke();
      }
    }
    this.context.closePath();
  }

  setScale(ev): void {
    console.log(this.map.scale > 0.1);
    if (ev.deltaY < 0) {
      this.map.scale = this.map.scale + 0.1;
    } else {
      if (this.map.scale > 0.2 && this.map.scale > -0.1) {
        this.map.scale = this.map.scale - 0.1;
      }
    }
  }

  onMouseDown(ev: MouseEvent): void {
    this.isDraggable = true;
    this.startX = ev.clientX - this.offsetX;
    this.startY = ev.clientY - this.offsetY;
  }

  onMouseMove(ev: MouseEvent): void {
    if (this.isDraggable) {
      this.mapPositionX = ev.clientX - this.startX;
      this.mapPositionY = ev.clientY - this.startY;
    }

    this.offsetX = this.mapPositionX;
    this.offsetY = this.mapPositionY;
  }

  onMouseUp(ev: MouseEvent): void {
    this.isDraggable = false;
  }

}
