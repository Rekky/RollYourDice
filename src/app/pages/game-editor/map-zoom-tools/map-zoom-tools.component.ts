import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-map-zoom-tools',
  templateUrl: './map-zoom-tools.component.html',
  styleUrls: ['./map-zoom-tools.component.scss']
})
export class MapZoomToolsComponent implements OnInit {

  @Input() zoom: number = 1;
  @Input() zoomStep: number = 0.1;
  @Input() max: number = 3;
  @Input() min: number = 0.3;

  @Output() zoomChange: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {}

  setZoom(zoom: number): void {
    if (zoom < this.min) {
      this.zoom = this.min;
      return;
    } else if (zoom > this.max) {
      this.zoom = this.max;
      return;
    }
    this.zoom = Math.round(zoom * 100) / 100;
    this.zoomChange.emit(this.zoom);
  }

}
