import {NgModule} from '@angular/core';
import {EnumToArrayPipe} from './pipes/enum-to-array-pipe';

@NgModule({
    declarations: [EnumToArrayPipe],
    imports: [],
    exports: [EnumToArrayPipe],
})

export class SharedModule { }
