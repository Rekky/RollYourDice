import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BlueprintNode} from '../../../models/blueprint-link';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Coords} from '../../../../classes/Coords';

@Component({
  selector: 'app-bb-on-overlap',
  templateUrl: './bb-on-overlap.component.html',
  styleUrls: ['./bb-on-overlap.component.scss']
})
export class BbOnOverlapComponent implements OnInit {
    @Input() bb: any;
    @Output() nodeOutHasBeenTouched: EventEmitter<BlueprintNode> = new EventEmitter<BlueprintNode>();

    form: FormGroup;

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
        this.initForm();
    }

    initForm(): void {
    }

    nodeOutClicked(ev, i: number): void {
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
