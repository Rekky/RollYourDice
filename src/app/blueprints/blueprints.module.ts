import {NgModule} from '@angular/core';
import {BlueprintsInterfaceComponent} from './blueprints-interface/blueprints-interface.component';
import {DraggableDirective} from './directives/draggable.directive';
import {DroppableDirective} from './directives/droppable.directive';
import {CommonModule} from '@angular/common';
import { BbAreaComponent } from './blueprint-boxes/elements/bb-area/bb-area.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared.module';
import { BbTeleportComponent } from './blueprint-boxes/actions/bb-teleport/bb-teleport.component';
import { BbGetAllActorsComponent } from './blueprint-boxes/actions/bb-get-all-actors/bb-get-all-actors.component';

@NgModule({
    declarations: [
        BlueprintsInterfaceComponent,
        DraggableDirective,
        DroppableDirective,
        BbAreaComponent,
        BbTeleportComponent,
        BbGetAllActorsComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule
    ],
    exports: [
        BlueprintsInterfaceComponent
    ],
})
export class BlueprintsModule { }
