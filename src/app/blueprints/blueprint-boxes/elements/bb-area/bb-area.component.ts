import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validator, Validators} from '@angular/forms';
import { BaseBlueprintBox } from 'src/app/blueprints/models/base-blueprint';
import { BBArea } from 'src/app/blueprints/models/bb-area';
import { Coords } from 'src/app/classes/Coords';
import {BlueprintLink, BlueprintNode} from '../../../models/blueprint-link';

@Component({
    selector: 'app-bb-area',
    templateUrl: './bb-area.component.html',
    styleUrls: ['./bb-area.component.scss']
})
export class BbAreaComponent implements OnInit {
    @Input() bb: BaseBlueprintBox;
    @Input() bbOwner: boolean;
    @Output() nodeOutHasBeenTouched: EventEmitter<BlueprintNode> = new EventEmitter<BlueprintNode>();
    @Output() nodeInHasBeenTouched: EventEmitter<BlueprintNode> = new EventEmitter<BlueprintNode>();

    form: FormGroup;
    area: BBArea;

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
        this.area = BBArea.create(this.bb);
        this.initForm();
    }

    initForm(): void {
        this.form = this.fb.group({
            name: [this.area.name, Validators.compose([Validators.required])],
        });
    }

    nodeInClicked(ev): void {
        ev.stopPropagation();
        const top = ev.target.offsetTop + 30 + this.area.position.y;
        const left = ev.target.offsetLeft + this.area.position.x;
        const newNode = new BlueprintNode();
        newNode.boxId = this.area.id;
        newNode.position = new Coords(left, top);
        this.nodeInHasBeenTouched.emit(newNode);
    }

    nodeOutClicked(ev): void {
        ev.stopPropagation();
        const top = ev.target.offsetTop + 30 + this.area.position.y;
        const left = ev.target.offsetLeft + this.area.position.x;
        const newNode = new BlueprintNode();
        newNode.boxId = this.area.id;
        newNode.position = new Coords(left, top);
        this.nodeOutHasBeenTouched.emit(newNode);
    }

    submit(): void {

    }

    delete(): void {

    }

}
