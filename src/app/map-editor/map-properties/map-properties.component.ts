import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Map } from '../../interfaces/Map';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-map-properties',
  templateUrl: './map-properties.component.html',
  styleUrls: ['./map-properties.component.scss']
})
export class MapPropertiesComponent implements OnInit {

  @Input() map: Map = null;
  @Output() mapChange: EventEmitter<Map> = new EventEmitter<Map>();

  mapForm: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.mapForm = new FormGroup({
      width: new FormControl(this.map.columns),
      height: new FormControl(this.map.rows)
    });
  }

  save(): void {
    console.log('entra en save', this.map);
    // this.map.width = this.mapForm.get('width').value;
    // this.map.height = this.mapForm.get('height').value;
    this.mapChange.emit(this.map);
  }

}
