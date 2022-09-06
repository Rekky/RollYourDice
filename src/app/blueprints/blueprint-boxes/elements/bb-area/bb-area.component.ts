import { Component, Input, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validator, Validators} from '@angular/forms';
import {BBArea} from '../../../../classes/Actor';

@Component({
    selector: 'app-bb-area',
    templateUrl: './bb-area.component.html',
    styleUrls: ['./bb-area.component.scss']
})
export class BbAreaComponent implements OnInit {
    @Input() area: BBArea;
    @Input() bbOwner: boolean;

    form: FormGroup;

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
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
