import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, RequiredValidator, Validators} from '@angular/forms';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

    formPersonalInformation: FormGroup;
    formPassword: FormGroup;
    formCommunications: FormGroup;

    constructor() {
        this.formPersonalInformation = new FormGroup({
            email: new FormControl(null, Validators.required)
        });

        this.formPassword = new FormGroup({
            oldPassword: new FormControl(null, Validators.required),
            password: new FormControl(null, Validators.required),
            repeatPassword: new FormControl(null, Validators.required)
        });

        this.formCommunications = new FormGroup({
            communications: new FormControl(true, Validators.required)
        });
    }

    ngOnInit(): void {
    }

}
