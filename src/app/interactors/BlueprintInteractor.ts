import {Injectable} from '@angular/core';
import {MapInteractor} from './MapInteractor';
import {Coords} from '../classes/Coords';
import {OurKonvaActor} from '../classes/ourKonva/OurKonvaActor';
import {MouseInteractor} from './MouseInteractor';


@Injectable({
    providedIn: 'root'
})
export class BlueprintInteractor {

    constructor(protected mapInteractor: MapInteractor, protected mouseInteractor: MouseInteractor) {

    }

    loadBlueprint(blueprint: any): void {
        if (!blueprint.blueprintBoxes) {
            throw new Error('not have blueprints to load');
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

    boxReader(box: any, data: any): void {
        let result;
        if (box.kind === 'GET_ALL_ACTORS') {
            result = new ExecuteGetAllActors().execute(this.mapInteractor.getCurrentMap());
        }
        if (box.kind === 'GET') {
            result = new ExecuteGet().execute(data, box.param.index);
        }
        if (box.kind === 'MOVE_ACTOR_TO_LOCATION') {
            result = new ExecuteMoveActorToLocation().execute(data, new Coords(box.param.x, box.param.y, box.param.z));
            console.log('---------------->', this.mapInteractor.getCurrentMap());
            this.mouseInteractor.updateObject(result);
            // todo buscar como pintar en locoal el actor que ya se ha movido y enviado por socket
        }
        console.log('boxReader', result);
        if (box.func) {
            this.boxReader(box.func, result);
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

    public execute(actor: OurKonvaActor, location: Coords): OurKonvaActor {
        actor.position.x = location.x;
        actor.position.y = location.y;
        return actor;
    }
}
