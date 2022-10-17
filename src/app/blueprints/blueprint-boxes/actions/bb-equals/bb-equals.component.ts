import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BlueprintNode} from '../../../models/blueprint-link';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Coords} from '../../../../classes/Coords';

@Component({
  selector: 'app-bb-equals',
  templateUrl: './bb-equals.component.html',
  styleUrls: ['./bb-equals.component.scss']
})
export class BbEqualsComponent implements OnInit {
    @Input() bb: any;
    @Output() nodeOutHasBeenTouched: EventEmitter<BlueprintNode> = new EventEmitter<BlueprintNode>();
    @Output() nodeInHasBeenTouched: EventEmitter<BlueprintNode> = new EventEmitter<BlueprintNode>();
    @Output() deleteBB: EventEmitter<void> = new EventEmitter<void>();

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
        this.deleteBB.emit();
    }

}
