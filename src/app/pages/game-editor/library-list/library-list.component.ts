import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LibraryInteractor} from '../../../interactors/LibraryInteractor';
import {Actor} from '../../../classes/Actor';
import {OurKonvaObject} from '../../../classes/ourKonva/OurKonvaObject';
import {Player} from '../../../classes/User';
import {OurKonvaImage} from '../../../classes/ourKonva/OurKonvaImage';
import {MouseInteractor} from '../../../interactors/MouseInteractor';
import {MapInteractor} from "../../../interactors/MapInteractor";

@Component({
    selector: 'app-library-list',
    templateUrl: './library-list.component.html',
    styleUrls: ['./library-list.component.scss']
})
export class LibraryListComponent implements OnInit {

    categories: any[] = [];
    currentCategory: string | null = null;
    openActorWizard: boolean = false;

    @Input() actors: any[] = [];
    @Input() selectedItem: any = null;
    @Output() onSelectedItemChanges: EventEmitter<any> = new EventEmitter<any>();
    @Output() onDeleteItemChanges: EventEmitter<any> = new EventEmitter<any>();

    constructor(private libraryInteractor: LibraryInteractor,
                private mouseInteractor: MouseInteractor,
                private mapInteractor: MapInteractor) {

    }

    ngOnInit(): void {
        //
    }

    async selectCategory(category: string): Promise<void> {
        this.currentCategory = category;
        this.actors = await this.libraryInteractor.getMyActors(category);
    }

    onAddActor(): void {
        this.openActorWizard = true;
    }

    onSelectedActor(actor: Actor): void {
        this.selectedItem = actor;
        this.onSelectedItemChanges.emit(this.selectedItem);
        this.paintActorOnMap(actor);
    }

    onDeleteActor(actor: Actor): void {
        this.libraryInteractor.deleteActor(actor);
        this.onDeleteItemChanges.emit(actor);
    }

    paintActorOnMap(actor: Actor): void {
        // const ourKonvaImage = new OurKonvaActor(new Player(), actor.asset.uri);
        this.mouseInteractor.addActorOnMap(actor);
    }

}
