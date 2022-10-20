import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BlueprintNode} from '../../../models/blueprint-link';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Coords} from '../../../../classes/Coords';

@Component({
  selector: 'app-bb-on-init',
  templateUrl: './bb-on-init.component.html',
  styleUrls: ['./bb-on-init.component.scss']
})
export class BbOnInitComponent implements OnInit {
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
        const top = ev.target.offsetTop + 30 + this.bb.render.position.y;
        const left = ev.target.offsetLeft + this.bb.render.position.x;
        this.nodeIn.boxId = this.bb.id;
        this.nodeIn.position = new Coords(left, top);
        this.nodeInHasBeenTouched.emit(this.nodeIn);
    }

    nodeOutClicked(ev): void {
        ev.stopPropagation();
        const top = ev.target.offsetTop + 30 + this.bb.render.position.y;
        const left = ev.target.offsetLeft + this.bb.render.position.x;
        this.nodeOut.boxId = this.bb.id;
        this.nodeOut.position = new Coords(left, top);
        this.nodeOutHasBeenTouched.emit(this.nodeOut);
    }

    submit(): void {

    }

    delete(): void {

    }

}
