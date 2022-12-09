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

    form: FormGroup;

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
        this.initForm();
    }

    initForm(): void {
    }

    submit(): void {

    }

}
