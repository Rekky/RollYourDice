import {Injectable} from '@angular/core';
import {MapInteractor} from './MapInteractor';
import {OurKonvaActor} from '../classes/ourKonva/OurKonvaActor';
import {MouseInteractor} from './MouseInteractor';
import { Actor } from '../classes/Actor';
import {BehaviorSubject, Observable} from 'rxjs';
import {CurrentSelectedKonvaObject} from '../classes/ourKonva/OurKonvaObject';
import {BlueprintModel} from '../blueprints/models/base-blueprint';

@Injectable({
    providedIn: 'root'
})
export class BlueprintInteractor {
    private displayedBlueprintActor: BehaviorSubject<Actor> = new BehaviorSubject<Actor>(null);

    constructor(protected mapInteractor: MapInteractor,
                protected mouseInteractor: MouseInteractor) {
    }

    setDisplayedBlueprintActor(blueprintActor: Actor): void {
        this.displayedBlueprintActor.next(blueprintActor);
    }

    getDisplayedBlueprintActorObs(): Observable<Actor> {
        return this.displayedBlueprintActor.asObservable();
    }

    loadBlueprintOnInit(blueprint: any): void {
        console.log('loadBlueprint');
        if (!blueprint.blueprintBoxes) {
            throw new Error('not have bleurprints to load');
        }
        if (blueprint.blueprintBoxes.onInit?.length > 0) {
            this.readerOnInit(blueprint.blueprintBoxes.onInit);
        }
    }

    readerOnInit(boxes: any): void {
        boxes.forEach(box => {
            this.boxReader(box, null);
        });
    }

    readerOnOverlap(boxes: any, mainActor: Actor, actionActor: Actor): void {
        boxes.forEach(box => {
            this.boxReader(box, {mainActor: mainActor, actionActor: actionActor, result: null});
        });
    }

    boxReader(box: any, data: any): void {
        if (box.kind === 'GET_ALL_ACTORS') {
            data.result = new ExecuteGetAllActors().execute(this.mapInteractor.getCurrentMap());
        }
        if (box.kind === 'GET') {
            data.result = new ExecuteGet().execute(data, box.param.index);
        }
        if (box.kind === 'MOVE_ACTOR_TO_LOCATION') {
            data.result = new ExecuteMoveActorToLocation().execute(data.actionActor, data.result);
            this.mouseInteractor.updateObjectOnMap(data.result);
        }
        if (box.func) {
            this.boxReader(box.func, data);
        }
    }
}


class ExecuteGetAllActors {

    public execute(map: any): OurKonvaActor[] {
        return map.objects.filter((obj: any) => obj.state === 'actor');
    }
}

class ExecuteGet {

    public execute(array: any[], index: number): OurKonvaActor {
        return array[index];
    }
}

class ExecuteMoveActorToLocation {

    public execute(actor: OurKonvaActor, locationActor: OurKonvaActor): OurKonvaActor {
        actor.position.x = locationActor.position.x;
        actor.position.y = locationActor.position.y;
        return actor;
    }
}

class ExecuteEquals {

    public execute(a: string, b: string): boolean {
        return a === b;
    }
}
