import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-editor-tools',
  templateUrl: './editor-tools.component.html',
  styleUrls: ['./editor-tools.component.scss']
})
export class EditorToolsComponent implements OnInit {

  @Input() currentToolSelected: string = 'move';
  @Output() toolSelectedChange: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onToolSelected(type: string): void {
    this.currentToolSelected = type;
    this.toolSelectedChange.emit(this.currentToolSelected);
  }

}
