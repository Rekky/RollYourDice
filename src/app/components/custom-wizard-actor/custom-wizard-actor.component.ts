import {Component, Input, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {AssetService} from '../../services/asset.service';
import {LibraryService} from '../../services/library.service';
import {Actor} from '../../classes/Actor';

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

    public fg: UntypedFormGroup;

    constructor(protected assetService: AssetService, protected libraryService: LibraryService) {
        this.fg = new UntypedFormGroup({
            hp: new UntypedFormControl(50, [Validators.required]),
            mp: new UntypedFormControl(50, [Validators.required]),
            name: new UntypedFormControl('new character', [Validators.required]),
            movement: new UntypedFormControl(3, [Validators.required]),
            asset: new UntypedFormControl(null, [Validators.required]),
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

    async createCharacter(): Promise<void> {
        try {
            const actor: Actor = new Actor();
            console.log('CREATE_CHARACTER', actor);
            await this.libraryService.createLibraryActor(actor);
        } catch (e) {
            console.log(e);
        }
    }

    onSelectedAsset(asset): void {
        this.fg.patchValue({asset: asset});
    }

}
