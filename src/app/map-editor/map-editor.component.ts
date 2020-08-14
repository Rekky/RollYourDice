import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Map } from '../interfaces/Map';

@Component({
  selector: 'app-map-editor',
  templateUrl: './map-editor.component.html',
  styleUrls: ['./map-editor.component.scss']
})
export class MapEditorComponent implements OnInit, AfterViewInit {

  @ViewChild('mapEl') canvasEl: ElementRef;
  map: Map = {width: 500, height: 500, y: 200, x: 1000, scale: 1};

  private context: CanvasRenderingContext2D;

  constructor() { }


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.context = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext('2d');
    this.drawCell();
  }

  drawCell() {
    // const c = <HTMLCanvasElement> document.getElementById('map');

    // this.context.fillStyle = "#D74022";
    // this.context.fillRect(25, 25, 150, 150);

    // ctx.fillStyle = "rgba(0,0,0,0.5)";
    // ctx.clearRect(60, 60, 120, 120);
    // ctx.strokeRect(90, 90, 80, 80);
    // this.context.fillText("@realappiee", 50, 50);

    // Box width
    const bw = 40;
    // Box height
    const bh = 40;
    // Padding
    const p = 0;

    for (let x = 0; x <= bw; x += 40) {
      this.context.moveTo(0.5 + x + p, p);
      this.context.lineTo(0.5 + x + p, bh + p);
    }

    for (let x = 0; x <= bh; x += 40) {
      this.context.moveTo(p, 0.5 + x + p);
      this.context.lineTo(bw + p, 0.5 + x + p);
    }

    this.context.strokeStyle = "black";
    this.context.stroke();
  }

  setScale(ev): void {
    console.log(ev);
    if (ev.deltaY > 0 && this.map.scale < 10) {
      this.map.scale = this.map.scale + 1;
    } else {
      if (this.map.scale !== 1) {
        this.map.scale = this.map.scale - 1;
      }
    }
  }

}
