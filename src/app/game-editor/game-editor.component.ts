import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Map} from '../interfaces/Map';
import {ApiService} from '../services/api.service';

@Component({
  selector: 'app-game-editor',
  templateUrl: './game-editor.component.html',
  styleUrls: ['./game-editor.component.scss']
})
export class GameEditorComponent implements OnInit, AfterViewInit {

  @ViewChild('mapEl') canvasEl: ElementRef;
  map: Map = null;
  tabs: number = 0;
  currentToolSelected: string = 'move';
  currentObjectSelected: any = null;

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

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.map = this.apiService.getMap();
  }

  ngAfterViewInit(): void {
    this.ctx = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext('2d');
    this.drawGrid(80, 5);
    this.canvasEl.nativeElement.addEventListener('mousemove', (e) => {
      this.findxy('move', e);
    }, false);
    this.canvasEl.nativeElement.addEventListener('mousedown', (e) => {
      this.findxy('down', e);
    }, false);
    this.canvasEl.nativeElement.addEventListener('mouseup', (e) => {
      this.findxy('up', e);
    }, false);
    this.canvasEl.nativeElement.addEventListener('mouseout', (e) => {
      this.findxy('out', e);
    }, false);
  }

  findxy(res, e): void {
    if (res === 'down') {
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
    if (res === 'up' || res === 'out') {
      this.flag = false;
    }
    if (res === 'move') {
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

  setCurrentObjectSelected(ev, object): void {
    ev.stopPropagation();

    if (this.currentObjectSelected !== null) {
      this.currentObjectSelected.ev.srcElement.style.border = '';
    }

    if (object !== null) {
      this.currentObjectSelected = {ev: ev, object: object};
      this.currentObjectSelected.ev.srcElement.style.border = '2px solid rgb(91, 146, 226)';
    }

  }

  onToolSelected(ev): void {
    console.log(ev);
    this.currentToolSelected = ev;

    switch (ev) {
      case 'text':
        this.drawTextCanvas();
        break;
      case 'draw-square':
        console.log('es draw square');
        break;
    }
  }

  drawGrid(columns: number, rows: number): void {
    const boxSize = 70;
    const boxes = Math.floor(this.mapWidth / boxSize);

    // this.ctx.beginPath();
    // this.ctx.fillStyle = 'white';
    // this.ctx.lineWidth = 2;
    // this.ctx.strokeStyle = 'black';
    // for (let row = 0; row < boxes; row++) {
    //   for (let column = 0; column < boxes; column++) {
    //     const x = column * boxSize;
    //     const y = row * boxSize;
    //     this.ctx.rect(x, y, boxSize, boxSize);
    //     this.ctx.fill();
    //     this.ctx.stroke();
    //   }
    // }




    const step = 25;

    // our end points
    const width = 500;
    const height = 500;

    // set our styles
    this.ctx.save();
    this.ctx.strokeStyle = 'lightgray' // line colors
    this.ctx.fillStyle = 'white' // text color
    this.ctx.font = '14px Monospace'
    this.ctx.lineWidth = 0.35

    // draw vertical from X to Height
    for (let x = 0; x < width; x += step) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
      this.ctx.stroke();

      // draw text
      this.ctx.fillText(String(x), x, 12);
    }

    // draw horizontal from Y to Width
    for (let y = 0; y < height; y += step) {
      // draw horizontal line
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
      this.ctx.stroke();

      // draw text
      this.ctx.fillText(String(y), 0, y);
    }

    // restore the styles from before this function was called
    this.ctx.restore();
  }

  drawTextCanvas(): void {
    this.ctx.font = '30px Arial';
    this.ctx.fillStyle = 'red';
    this.ctx.fillText('Hello World', 10, 50);
  }

  updateProperties(ev): void {
    console.log('update', ev);
    // this.ctx.clearRect(0, 0, this.map.columns, this.map.rows);
    // this.drawGrid(80, 50);
  }

  /** --------- EVENTS FOR MOVE MAP ----------- */
  onMouseDown(ev: MouseEvent): void {
    this.isDraggable = true;
    this.startX = ev.clientX - this.offsetX;
    this.startY = ev.clientY - this.offsetY;
  }

  onMouseMove(ev: MouseEvent): void {
    if (this.isDraggable && this.currentToolSelected === 'move') {
      this.mapPositionX = ev.clientX - this.startX;
      this.mapPositionY = ev.clientY - this.startY;
    }
    this.offsetX = this.mapPositionX;
    this.offsetY = this.mapPositionY;
  }

  onMouseUp(ev: MouseEvent): void {
    this.isDraggable = false;
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
