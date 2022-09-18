import {Component, Input, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {AssetService} from '../../services/asset.service';
import {Actor} from '../../classes/Actor';
import {Character} from '../../classes/Character';
import {LibraryInteractor} from '../../interactors/LibraryInteractor';
import {Monster} from '../../classes/Monster';

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

    constructor(protected assetService: AssetService, protected libraryInteractor: LibraryInteractor) {
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

    async createActor(): Promise<void> {
        let actor: Actor = null;
        console.log('wizard-createActor');
        try {
            switch (this.currentActorType) {
                case 'CHARACTER':
                    const character = new Character();
                    actor = {...this.fg.value, ...character};
                    break;
                case 'MONSTER':
                    actor = new Monster();
                    break;
                case 'NPC':
                    // todo
                    break;
                case 'OBJECT':
                    // todo
                    break;
                case 'SPELL':
                    // todo
                    break;
                case 'PET':
                    // todo
                    break;
            }
        } catch (e) {
            console.log(e);
        } finally {
            await this.libraryInteractor.createActor(actor);
        }
    }

    onSelectedAsset(asset): void {
        this.fg.patchValue({asset});
    }

}
