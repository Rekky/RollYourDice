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
  imgURL: any = null;
  imagePath: string = null;
  errorMessage: string = null;

  constructor() { }

  ngOnInit(): void {
    this.mapForm = new FormGroup({
      width: new FormControl(this.map.columns),
      height: new FormControl(this.map.rows),
      cellWidth: new FormControl(this.map.cellWidth)
    });
  }

  setBackgroundImage(): void {
    const background = new Image();
    background.src = 'https://triumvene.com/content/images/2019/08/f54890248-1-.jpg';
    this.map.background = background.src;
  }

  preview(files): void {
    if (files.length === 0) {
      return;
    }

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.errorMessage = 'Only images are supported.';
      return;
    }

    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      console.log('->>>>>>>>>>>>', reader);
      this.imgURL = reader.result;
    };
  }

  save(): void {
    console.log('SAVE', this.map);
    // this.map.width = this.mapForm.get('width').value;
    // this.map.height = this.mapForm.get('height').value;
    this.map.cellWidth = this.mapForm.get('cellWidth').value;
    this.mapChange.emit(this.map);
  }

}
