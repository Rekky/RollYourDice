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

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild('mapEl') canvasEl: ElementRef;
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

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.ctx = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext('2d');
    // this.drawGrid(80, 5);
    this.canvasEl.nativeElement.addEventListener('mousemove', (e) => {
      if (this.currentToolSelected === 'move') {
        this.mapMove('mousemove', e);
      } else if (this.currentToolSelected === 'draw') {
        this.findxy('mousemove', e);
      }
    }, false);
    this.canvasEl.nativeElement.addEventListener('mousedown', (e) => {
      if (this.currentToolSelected === 'move') {
        this.mapMove('mousedown', e);
      } else if (this.currentToolSelected === 'draw') {
        this.findxy('mousedown', e);
      }
    }, false);
    this.canvasEl.nativeElement.addEventListener('mouseup', (e) => {
      if (this.currentToolSelected === 'move') {
        this.mapMove('mouseup', e);
      } else if (this.currentToolSelected === 'draw') {
        this.findxy('mouseup', e);
      }
    }, false);
    this.canvasEl.nativeElement.addEventListener('mouseout', (e) => {
      this.findxy('out', e);
    }, false);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map != null) {
      setTimeout(() => {
        this.drawGrid(80, 5);
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

    const background = new Image();
    background.src = this.map.background;

    if (background.src === null) {
      return;
    }

    background.onload = () => {
      this.ctx.drawImage(background, 0, 0, width, height);


      // set our styles
      this.ctx.save();
      this.ctx.strokeStyle = 'lightgray'; // line colors
      this.ctx.fillStyle = 'white'; // text color
      this.ctx.font = '14px Monospace';
      this.ctx.lineWidth = 0.35;

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
