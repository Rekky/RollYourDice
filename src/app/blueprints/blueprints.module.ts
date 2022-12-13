import {NgModule} from '@angular/core';
import {BlueprintsInterfaceComponent} from './blueprints-interface/blueprints-interface.component';
import {DraggableDirective} from './directives/draggable.directive';
import {DroppableDirective} from './directives/droppable.directive';
import {CommonModule} from '@angular/common';
import { BbAreaComponent } from './blueprint-boxes/elements/bb-area/bb-area.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared.module';
import { BbTeleportComponent } from './blueprint-boxes/actions/bb-teleport/bb-teleport.component';
import { BbGetAllActorsComponent } from './blueprint-boxes/actions/bb-get-all-actors/bb-get-all-actors.component';
import { BbEqualsComponent } from './blueprint-boxes/actions/bb-equals/bb-equals.component';
import { BbMoveActorToLocationComponent } from './blueprint-boxes/actions/bb-move-actor-to-location/bb-move-actor-to-location.component';
import { BbGetComponent } from './blueprint-boxes/actions/bb-get/bb-get.component';
import { BbOnInitComponent } from './blueprint-boxes/events/bb-on-init/bb-on-init.component';
import { BbOnOverlapComponent } from './blueprint-boxes/events/bb-on-overlap/bb-on-overlap.component';
import { BbWrappingComponent } from './blueprint-boxes/bb-wrapping/bb-wrapping.component';
import { BbCountdownComponent } from './blueprint-boxes/actions/bb-countdown/bb-countdown.component';
import { BbSwitchIntegerComponent } from './blueprint-boxes/operators/bb-switch-integer/bb-switch-integer.component';

@NgModule({
    declarations: [
        BlueprintsInterfaceComponent,
        DraggableDirective,
        DroppableDirective,
        BbAreaComponent,
        BbTeleportComponent,
        BbGetAllActorsComponent,
        BbEqualsComponent,
        BbMoveActorToLocationComponent,
        BbGetComponent,
        BbOnInitComponent,
        BbOnOverlapComponent,
        BbWrappingComponent,
        BbCountdownComponent,
        BbSwitchIntegerComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        FormsModule
    ],
    exports: [
        BlueprintsInterfaceComponent
    ],
})
export class BlueprintsModule { }
