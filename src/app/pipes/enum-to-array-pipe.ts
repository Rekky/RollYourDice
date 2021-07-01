import {Pipe, PipeTransform} from '@angular/core';
import {LibrarySections} from '../pages/game-editor/editor-libraries/editor-libraries.component';

@Pipe({
    name: 'enumToArray'
})
export class EnumToArrayPipe implements PipeTransform {
    transform(data: any): LibrarySections[] {
        return Object.values(data);
        // return keys.slice(keys.length / 2);
    }
}
