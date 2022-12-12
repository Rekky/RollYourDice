import {Injectable} from '@angular/core';
import {MapInteractor} from './MapInteractor';
import {OurKonvaActor} from '../classes/ourKonva/OurKonvaActor';
import {MouseInteractor} from './MouseInteractor';
import { Actor } from '../classes/Actor';
import {BehaviorSubject, Observable} from 'rxjs';
import {CurrentSelectedKonvaObject} from '../classes/ourKonva/OurKonvaObject';
import {BlueprintModel} from '../blueprints/models/base-blueprint';
import {BoxKindEnum} from '../blueprints/models/blueprint-boxes';
import {finalize, take, tap} from 'rxjs/operators';

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
            throw new Error('no blueprints to load');
        }
        if (blueprint.blueprintBoxes.onInit?.length > 0) {
            this.readerOnInit(blueprint.blueprintBoxes.onInit);
        }
    }

    readerOnInit(boxes: any): void {
        boxes.forEach(box => {
            this.boxReader(box, {mainActor: null, actionActor: null, result: null});
        });
    }

    readerOnOverlap(boxes: any, mainActor: Actor, actionActor: Actor): void {
        boxes.forEach(box => {
            this.boxReader(box, {mainActor: mainActor, actionActor: actionActor, result: null});
        });
    }

    boxReader(box: any, data: any): void {
        console.log('box =', box);
        if (box.kind === BoxKindEnum.GET_ALL_ACTORS) {
            data.result = new ExecuteGetAllActors().execute(this.mapInteractor.getCurrentMap());
        }
        if (box.kind === BoxKindEnum.GET) {
            data.result = new ExecuteGet().execute(data, box.param.index);
        }
        if (box.kind === BoxKindEnum.MOVE_ACTOR_TO_LOCATION) {
            data.result = new ExecuteMoveActorToLocation().execute(data.actionActor, data.result);
            this.mouseInteractor.updateObjectOnMap(data.result);
        }
        if (box.kind === BoxKindEnum.COUNTDOWN) {
            console.log('-----------------------------');
            new ExecuteCountdown().execute(box.seconds, box.isLoop).pipe(
                tap((t: any) => {
                    console.log(t);
                }),
                finalize(() => {
                    data.result = true;
                    console.log('end');
                })
            ).subscribe();
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

class ExecuteCountdown {

    public execute(time: number, loop: boolean): Observable<boolean> {
        return new Observable(obs => {
            let t = time;
            const interval = setInterval(() => {
                console.log(t);
                t = t - 1;
                if (t === 0) {
                    if (!loop) {
                        clearInterval(interval);
                        obs.complete();
                    }
                    t = time;
                    obs.next(true);
                }
            }, 1000);
        });
    }
}

class ExecuteEquals {

    public execute(a: string, b: string): boolean {
        return a === b;
    }
}
