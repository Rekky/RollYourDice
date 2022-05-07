import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-modal-custom',
  templateUrl: './modal-custom.component.html',
  styleUrls: ['./modal-custom.component.scss']
})
export class ModalCustomComponent implements OnInit {

  @Input() open = false;
  @Output() openChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

}
