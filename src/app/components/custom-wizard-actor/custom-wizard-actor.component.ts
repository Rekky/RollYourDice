import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-custom-wizard-actor',
    templateUrl: './custom-wizard-actor.component.html',
    styleUrls: ['./custom-wizard-actor.component.scss']
})
export class CustomWizardActorComponent implements OnInit {

    @Input() steps: number = 0;
    @Input() currentStep: number = 0;
    protected currentActorType: string = null;

    public fg: FormGroup;

    constructor() {
        this.fg = new FormGroup({
            hp: new FormControl(50, [Validators.required]),
            mp: new FormControl(50, [Validators.required]),
            name: new FormControl('new character', [Validators.required]),
            movement: new FormControl(3, [Validators.required]),
        });
    }

    ngOnInit(): void {
    }

    selectActorType(type: string): void {
        this.currentStep = 1;
        this.currentActorType = type;
    }

}
