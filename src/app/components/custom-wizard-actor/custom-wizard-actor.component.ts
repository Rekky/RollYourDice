import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AssetService} from '../../services/asset.service';

@Component({
    selector: 'app-custom-wizard-actor',
    templateUrl: './custom-wizard-actor.component.html',
    styleUrls: ['./custom-wizard-actor.component.scss']
})
export class CustomWizardActorComponent implements OnInit {

    @Input() steps: number = 0;
    @Input() currentStep: number = 0;
    protected currentActorType: string = null;

    public assets: any[] = [];
    showAssets: boolean = false;

    public fg: FormGroup;

    constructor(protected assetService: AssetService) {
        this.fg = new FormGroup({
            hp: new FormControl(50, [Validators.required]),
            mp: new FormControl(50, [Validators.required]),
            name: new FormControl('new character', [Validators.required]),
            movement: new FormControl(3, [Validators.required]),
        });
    }

    async ngOnInit(): Promise<void> {
        this.assets = await this.assetService.getAllAssets();
        console.log(this.assets);
    }

    selectActorType(type: string): void {
        this.currentStep = 1;
        this.currentActorType = type;
    }

}
