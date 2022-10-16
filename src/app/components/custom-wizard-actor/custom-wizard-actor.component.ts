import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {AssetService} from '../../services/asset.service';
import {Actor, ActorTypesEnum, CHARACTER, MONSTER, NPC, OBJECT, PET, SPELL} from '../../classes/Actor';
import {LibraryInteractor} from '../../interactors/LibraryInteractor';


@Component({
    selector: 'app-custom-wizard-actor',
    templateUrl: './custom-wizard-actor.component.html',
    styleUrls: ['./custom-wizard-actor.component.scss']
})
export class CustomWizardActorComponent implements OnInit {

    @Input() open: boolean = false;
    @Input() openChanges: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() currentStep: number = 1;
    protected currentActorType: ActorTypesEnum = ActorTypesEnum.CHARACTER;

    public assets: any[] = [];
    showAssets: boolean = false;

    public fg: UntypedFormGroup;
    public ActorTypesEnum = ActorTypesEnum;

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
    }

    selectActorType(type: ActorTypesEnum): void {
        console.log(type);
        this.currentStep = 1;
        this.currentActorType = type;
    }

    async createActor(): Promise<void> {
        let actor: Actor = null;
        console.log('createActor', this.currentActorType);
        try {
            switch (this.currentActorType) {
                case ActorTypesEnum.CHARACTER:
                    const character = new CHARACTER();
                    actor = {...this.fg.value, ...character};
                    break;
                case ActorTypesEnum.MONSTER:
                    actor = new MONSTER();
                    break;
                case ActorTypesEnum.NPC:
                    actor = new NPC();
                    break;
                case ActorTypesEnum.OBJECT:
                    actor = new OBJECT();
                    break;
                case ActorTypesEnum.SPELL:
                    actor = new SPELL();
                    break;
                case ActorTypesEnum.PET:
                    actor = new PET();
                    break;
                default:
                    break;
            }
            await this.libraryInteractor.createActor(actor);
        } catch (e) {
            console.log(e);
        } finally {
            this.open = false;
            this.openChanges.emit(this.open);
        }
    }

    onSelectedAsset(asset): void {
        this.fg.patchValue({asset});
    }

}
