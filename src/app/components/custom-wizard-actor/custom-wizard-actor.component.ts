import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {AssetService} from '../../services/asset.service';
import {Actor, ActorTypesEnum, CARD, CHARACTER, MONSTER, NPC, OBJECT, PET, SPELL} from '../../classes/Actor';
import {LibraryInteractor} from '../../interactors/LibraryInteractor';


@Component({
    selector: 'app-custom-wizard-actor',
    templateUrl: './custom-wizard-actor.component.html',
    styleUrls: ['./custom-wizard-actor.component.scss']
})
export class CustomWizardActorComponent implements OnInit {

    @Input() open: boolean = false;
    @Output() openChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() currentStep: number = 1;
    @Output() createActorEvent: EventEmitter<Actor> = new EventEmitter<Actor>();
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

    close(): void {
        this.open = false;
        this.openChange.emit(this.open);
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
                case ActorTypesEnum.CARD:
                    const card = new CARD();
                    actor = {...this.fg.value, ...card};
                    break;
                default:
                    break;
            }
            await this.libraryInteractor.createActor(actor);
            this.createActorEvent.emit(actor);
        } catch (e) {
            console.log(e);
        } finally {
            this.open = false;
            this.openChange.emit(this.open);
        }
    }

    onSelectedAsset(asset): void {
        this.fg.patchValue({asset});
    }

}
