import {Injectable} from '@angular/core';
import {MapInteractor} from './MapInteractor';
import {OurKonvaActor} from '../classes/ourKonva/OurKonvaActor';
import {MouseInteractor} from './MouseInteractor';
import { Actor } from '../classes/Actor';
import {BehaviorSubject, Observable} from 'rxjs';
import {CurrentSelectedKonvaObject} from '../classes/ourKonva/OurKonvaObject';
import {BlueprintModel} from '../blueprints/models/base-blueprint';
import {BoxKindEnum} from '../blueprints/models/blueprint-boxes';
import {finalize, map, switchMap, take, tap} from 'rxjs/operators';

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
        if (box.kind === BoxKindEnum.ON_INIT) {
            if (box.func.length > 0) {
                box.func.forEach(fun => this.boxReader(fun, data));
            }
        }
        if (box.kind === BoxKindEnum.GET_ACTORS) {
            data.result = new ExecuteGetActors().execute(this.mapInteractor.getCurrentMap(), box.filters);
            if (box.func.length > 0) {
                box.func.forEach(fun => this.boxReader(fun, data));
            }
        }
        // if (box.kind === BoxKindEnum.GET) {
        //     data.result = new ExecuteGet().execute(data, box.param.index);
        //     this.boxReader(box.func, data);
        // }
        // if (box.kind === BoxKindEnum.MOVE_ACTOR_TO_LOCATION) {
        //     data.result = new ExecuteMoveActorToLocation().execute(data.actionActor, data.result);
        //     this.mouseInteractor.updateObjectOnMap(data.result);
        //     this.boxReader(box.func, data);
        // }
        if (box.kind === BoxKindEnum.COUNTDOWN) {
            new ExecuteCountdown().execute(box.seconds, box.isLoop).subscribe(() => {
                console.log('now');
                if (box.func.length > 0) {
                    box.func.forEach(fun => this.boxReader(fun, data));
                    box.func[0].integer === box.func[0].func.length - 1 ? box.func[0].integer = 0 : box.func[0].integer++; // TODO en un futur no ha de ser així, el valor ha de ser una variable blueprint
                }
            });
        }
        if (box.kind === BoxKindEnum.SWITCH_INTEGER) {
            console.log('integer =', box.integer);
            // new ExecuteSwitchInteger().execute(box.integer);
            this.boxReader(box.func[box.integer], data);
        }
    }
}


class ExecuteGetActors {

    public execute(map: any, filters: any): OurKonvaActor[] {
        console.log('actors of type =', filters.type);
        let actors = map.objects.filter((obj: any) => obj.state === 'actor');
        if (filters.type) {
            actors = actors.filter((obj: any) => obj.type === filters.type);
        }
        return actors;
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

    public execute(time: number, loop: boolean): Observable<void> {
        return new Observable(obs => {
            const interval = setInterval(() => {
                if (!loop) {
                    clearInterval(interval);
                    obs.complete();
                }
                obs.next();
            }, time * 1000);
        });
    }
}

class ExecuteSwitchInteger {

    public execute(int: number): void {
        console.log('integer =', int);
    }
}

class ExecuteEquals {

    public execute(a: string, b: string): boolean {
        return a === b;
    }
}
