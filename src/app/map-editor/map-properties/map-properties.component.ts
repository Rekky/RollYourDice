import {Component, Input, OnInit} from '@angular/core';
import { Map } from '../../interfaces/Map';

@Component({
  selector: 'app-map-properties',
  templateUrl: './map-properties.component.html',
  styleUrls: ['./map-properties.component.scss']
})
export class MapPropertiesComponent implements OnInit {

  @Input() map: Map = null;

  constructor() { }

  ngOnInit(): void {
  }

}
