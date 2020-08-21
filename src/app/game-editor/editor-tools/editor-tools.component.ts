import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-editor-tools',
  templateUrl: './editor-tools.component.html',
  styleUrls: ['./editor-tools.component.scss']
})
export class EditorToolsComponent implements OnInit {

  @Output() toolSelectedChange: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onToolSelected(type: string): void {
    this.toolSelectedChange.emit(type);
  }

}
