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

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
        this.initForm();
    }

    initForm(): void {
    }

    nodeInClicked(ev, i): void {
        ev.stopPropagation();
        const top = ev.target.offsetTop + 30 + this.bb.render.position.y;
        const left = ev.target.offsetLeft + this.bb.render.position.x;
        this.bb.render.nodes.startingNodes[i].position = new Coords(left, top);
        this.nodeInHasBeenTouched.emit(this.bb.render.nodes.startingNodes[i]);
    }

    nodeOutClicked(ev, i): void {
        ev.stopPropagation();
        const top = ev.target.offsetTop + 30 + this.bb.render.position.y;
        const left = ev.target.offsetLeft + this.bb.render.position.x;
        this.bb.render.nodes.endingNodes[i].position = new Coords(left, top);
        this.nodeOutHasBeenTouched.emit(this.bb.render.nodes.endingNodes[i]);
    }

    submit(): void {

    }

    delete(): void {

    }

}
