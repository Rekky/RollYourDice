import { Component, Input, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validator, Validators} from '@angular/forms';
import { BaseBlueprintBox } from 'src/app/blueprints/models/base-blueprint';
import { BBArea } from 'src/app/blueprints/models/bb-area';

@Component({
    selector: 'app-bb-area',
    templateUrl: './bb-area.component.html',
    styleUrls: ['./bb-area.component.scss']
})
export class BbAreaComponent implements OnInit {
    @Input() bb: BaseBlueprintBox;
    @Input() bbOwner: boolean;

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

    submit(): void {

    }

    delete(): void {

    }

}
