import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import { Map } from '../interfaces/Map';

@Component({
  selector: 'app-map-editor',
  templateUrl: './map-editor.component.html',
  styleUrls: ['./map-editor.component.scss']
})
export class MapEditorComponent implements OnInit, AfterViewInit {

  @ViewChild('mapEl') canvasEl: ElementRef;
  map: Map = {width: 400, height: 400, y: 100, x: 500, scale: 1};
  currentObjectSelected: any = null;

  private context: CanvasRenderingContext2D;
  protected isDraggable: boolean = false;
  protected startX: number;
  protected startY: number;
  protected endX: number;
  protected endY: number;
  protected offsetX: number = 0;
  protected offsetY: number = 0;

  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.windowWidth = event.target.innerWidth;
  }

  constructor() { }


  ngOnInit(): void {
    console.log(window.innerWidth);
  }

  ngAfterViewInit(): void {
    this.context = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext('2d');
    this.drawGrid(200, 200);
  }

  setCurrentObjectSelected(ev, object): void {
    ev.stopPropagation();
    this.currentObjectSelected = object;
  }

  drawGrid(width: number, height: number): void {
    const s = 32;
    const pL = 0;
    const pT = 0;
    const pR = 0;
    const pB = 0;

    this.context.canvas.width = width;
    this.context.canvas.height = height;

    this.context.strokeStyle = 'lightgrey';
    this.context.beginPath();
    for (let x = pL; x <= width - pR; x += s) {
      this.context.moveTo(x, pT);
      this.context.lineTo(x, width - pB);
    }
    for (let y = pT; y <= height - pB; y += s) {
      this.context.moveTo(pL, y);
      this.context.lineTo(height - pR, y);
    }
    this.context.stroke();
  }

  setScale(ev): void {
    if (ev.deltaY < 0) {
      this.map.scale = this.map.scale + 0.5;
    } else {
      if (this.map.scale !== 1) {
        this.map.scale = this.map.scale - 0.5;
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
      this.map.x = ev.clientX - this.startX;
      this.map.y = ev.clientY - this.startY;
    }

    this.offsetX = this.map.x;
    this.offsetY = this.map.y;
  }

  onMouseUp(ev: MouseEvent): void {
    this.isDraggable = false;
  }

}
