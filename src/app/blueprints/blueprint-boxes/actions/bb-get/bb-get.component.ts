import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BlueprintNode} from '../../../models/blueprint-link';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Coords} from '../../../../classes/Coords';

@Component({
  selector: 'app-bb-get',
  templateUrl: './bb-get.component.html',
  styleUrls: ['./bb-get.component.scss']
})
export class BbGetComponent implements OnInit {
    @Input() bb: any;
    @Output() nodeOutHasBeenTouched: EventEmitter<BlueprintNode> = new EventEmitter<BlueprintNode>();
    @Output() nodeInHasBeenTouched: EventEmitter<BlueprintNode> = new EventEmitter<BlueprintNode>();

    form: FormGroup;
    nodeIn: BlueprintNode = new BlueprintNode();
    nodeOut: BlueprintNode = new BlueprintNode();

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
        this.initForm();
    }

    initForm(): void {
    }

    nodeInClicked(ev): void {
        ev.stopPropagation();
        const top = ev.target.offsetTop + 30 + this.bb.position.y;
        const left = ev.target.offsetLeft + this.bb.position.x;
        this.nodeIn.boxId = this.bb.id;
        this.nodeIn.position = new Coords(left, top);
        this.nodeInHasBeenTouched.emit(this.nodeIn);
    }

    nodeOutClicked(ev): void {
        ev.stopPropagation();
        const top = ev.target.offsetTop + 30 + this.bb.position.y;
        const left = ev.target.offsetLeft + this.bb.position.x;
        this.nodeOut.boxId = this.bb.id;
        this.nodeOut.position = new Coords(left, top);
        this.nodeOutHasBeenTouched.emit(this.nodeOut);
    }

    submit(): void {

    }

    delete(): void {

    }

}
