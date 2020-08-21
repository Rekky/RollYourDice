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
  currentObjectSelected: any = null;

  private context: CanvasRenderingContext2D;
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

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.map = this.apiService.getMap();
  }

  ngAfterViewInit(): void {
    this.context = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext('2d');
    this.drawGrid(80, 5);
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

  updateProperties(ev): void {
    console.log('update', ev);
    // this.context.clearRect(0, 0, this.map.columns, this.map.rows);
    // this.drawGrid(80, 50);
  }

  /** --------- EVENTS FOR MOVE MAP ----------- */
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
