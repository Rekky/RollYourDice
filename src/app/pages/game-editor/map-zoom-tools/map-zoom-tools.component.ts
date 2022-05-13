import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-map-zoom-tools',
  templateUrl: './map-zoom-tools.component.html',
  styleUrls: ['./map-zoom-tools.component.scss']
})
export class MapZoomToolsComponent implements OnInit {

  @Input() zoom: number = 0;
  @Output() zoomChange: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  setZoom(zoom: number):void {
    this.zoom = zoom;
    this.zoomChange.emit(this.zoom);
  }

}
