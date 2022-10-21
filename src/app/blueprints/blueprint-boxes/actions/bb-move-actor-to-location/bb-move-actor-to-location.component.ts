import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BlueprintNode} from '../../../models/blueprint-link';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Coords} from '../../../../classes/Coords';

@Component({
  selector: 'app-bb-move-actor-to-location',
  templateUrl: './bb-move-actor-to-location.component.html',
  styleUrls: ['./bb-move-actor-to-location.component.scss']
})
export class BbMoveActorToLocationComponent implements OnInit {
    @Input() bb: any;
    @Output() nodeInHasBeenTouched: EventEmitter<BlueprintNode> = new EventEmitter<BlueprintNode>();

    form: FormGroup;

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

    submit(): void {

    }

    delete(): void {

    }

}
