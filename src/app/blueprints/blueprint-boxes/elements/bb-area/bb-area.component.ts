import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChange,
    SimpleChanges
} from '@angular/core';
import {FormBuilder, FormGroup, Validator, Validators} from '@angular/forms';
import { BaseBlueprintBox } from 'src/app/blueprints/models/base-blueprint';
import { BBArea } from 'src/app/blueprints/models/blueprint-boxes';
import { Coords } from 'src/app/classes/Coords';
import {BlueprintLink, BlueprintNode} from '../../../models/blueprint-link';

@Component({
    selector: 'app-bb-area',
    templateUrl: './bb-area.component.html',
    styleUrls: ['./bb-area.component.scss']
})
export class BbAreaComponent implements OnInit {
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
        this.form = this.fb.group({
            name: [this.bb.name, Validators.compose([Validators.required])],
        });
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
