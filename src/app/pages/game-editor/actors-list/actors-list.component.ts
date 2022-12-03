import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ulid } from 'ulid';
import {Actor} from '../../../classes/Actor';
import {LibraryInteractor} from '../../../interactors/LibraryInteractor';
import {MouseInteractor} from '../../../interactors/MouseInteractor';

@Component({
    selector: 'app-actors-list',
    templateUrl: './actors-list.component.html',
    styleUrls: ['./actors-list.component.scss']
})
export class ActorsListComponent implements OnInit {

    openActorWizard: boolean = false;
    @Input() actors: any[] = [];
    @Input() selectedItem: any = null;
    @Output() onSelectedItemChanges: EventEmitter<any> = new EventEmitter<any>();
    @Output() onDeleteItemChanges: EventEmitter<any> = new EventEmitter<any>();

    currentCategory: string | null = null;

    constructor(private libraryInteractor: LibraryInteractor,
                private mouseInteractor: MouseInteractor) {
    }

    ngOnInit(): void {
    }

    async selectCategory(category: string): Promise<void> {
        this.currentCategory = category;
        await this.getMyActorsFromInteractor();
    }

    async getMyActorsFromInteractor(): Promise<void> {
        this.actors = await this.libraryInteractor.getMyActors(this.currentCategory);
    }

    async onCreateActor(actor: Actor): Promise<void> {
        await this.getMyActorsFromInteractor();
    }

    onSelectedActor(actor: Actor): void {
        this.selectedItem = actor;
        this.onSelectedItemChanges.emit(this.selectedItem);
        this.paintActorOnMap(actor);
    }

    async onDeleteActor(actor: Actor): Promise<void> {
        await this.libraryInteractor.deleteActor(actor);
        this.onDeleteItemChanges.emit(actor);
    }

    paintActorOnMap(actor: Actor): void {
        const newActor = { ...new Actor(), ...actor };
        newActor.id = ulid();
        this.mouseInteractor.addActorOnMap(newActor);
    }

}
