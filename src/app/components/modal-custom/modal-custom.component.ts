import { Component, EventEmitter, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-modal-custom',
  templateUrl: './modal-custom.component.html',
  styleUrls: ['./modal-custom.component.scss']
})
export class ModalCustomComponent implements OnInit {

  @Input() open = false;
  @Input() openChange: EventEmitter<boolean> =  new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
