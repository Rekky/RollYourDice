import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BlueprintNode} from '../../models/blueprint-link';
import {Coords} from '../../../classes/Coords';

@Component({
  selector: 'app-bb-wrapping',
  templateUrl: './bb-wrapping.component.html',
  styleUrls: ['./bb-wrapping.component.scss']
})
export class BbWrappingComponent {
    @Input() bb: any;
    @Output() nodeInHasBeenTouched: EventEmitter<BlueprintNode> = new EventEmitter<BlueprintNode>();
    @Output() nodeOutHasBeenTouched: EventEmitter<BlueprintNode> = new EventEmitter<BlueprintNode>();

    constructor() {
    }

    nodeInClicked(ev, i): void {
        ev.stopPropagation();
        const top = ev.target.offsetTop + 30 + this.bb.render.position.y;
        const left = ev.target.offsetLeft + this.bb.render.position.x;
        this.bb.render.nodes.startingNodes[i].position = new Coords(left, top);
        this.nodeInHasBeenTouched.emit(this.bb.render.nodes.startingNodes[i]);
    }

    nodeOutClicked(ev, i: number): void {
        ev.stopPropagation();
        const top = ev.target.offsetTop + 30 + this.bb.render.position.y;
        const left = ev.target.offsetLeft + this.bb.render.position.x;
        this.bb.render.nodes.endingNodes[i].position = new Coords(left, top);
        this.nodeOutHasBeenTouched.emit(this.bb.render.nodes.endingNodes[i]);
    }

    delete(): void {

    }
}
