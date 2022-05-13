import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-map-zoom-tools',
  templateUrl: './map-zoom-tools.component.html',
  styleUrls: ['./map-zoom-tools.component.scss']
})
export class MapZoomToolsComponent implements OnInit {

  @Input() zoom: number = 1;
  @Input() zoomStep: number = 0.1;
  @Input() maxZoom: number = 3;
  @Input() minZoom: number = 0.3;

  @Output() zoomChange: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {}

  setZoom(zoom: number): void {
    if (zoom < this.minZoom) {
      this.zoom = this.minZoom;
      return;
    } else if (zoom > this.maxZoom) {
      this.zoom = this.maxZoom;
      return;
    }
    this.zoom = Math.round(zoom * 100) / 100;
    this.zoomChange.emit(this.zoom);
  }

}
