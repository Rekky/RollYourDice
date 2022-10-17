import {Injectable} from '@angular/core';
import {MapInteractor} from './MapInteractor';


@Injectable({
    providedIn: 'root'
})
export class BlueprintInteractor {

    constructor(protected mapInteractor: MapInteractor) {

    }

    loadBlueprint(blueprint: any): void {
        console.log('loadBlueprint', blueprint);
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

    boxReader(box: any, data: any): void {
        let result;
        if (box.kind === 'GET_ALL_ACTORS') {
            result = new ExecuteGetAllActors().execute(this.mapInteractor.getCurrentMap());
        }
        if (box.kind === 'GET') {
            result = new ExecuteGet().execute(data, box.param.index);
        }
        console.log(result);
        if (box.func) {
            this.boxReader(box.func, result);
        }
    }

    executeBlueprint(blueprint: any): void {
        console.log('executeBlueprint', blueprint);
    }
}


class ExecuteGetAllActors {

    public execute(map: any): any {
        return map.objects.filter((obj: any) => obj.state === 'square');
    }
}

class ExecuteGet {

    public execute(array: any[], index: number): any {
        return array[index];
    }
}
