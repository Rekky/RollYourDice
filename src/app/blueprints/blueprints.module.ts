import {NgModule} from '@angular/core';
import {BlueprintsInterfaceComponent} from './blueprints-interface/blueprints-interface.component';
import {DraggableDirective} from './directives/draggable.directive';
import {DroppableDirective} from './directives/droppable.directive';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared.module';
import { BbOnInitComponent } from './blueprint-boxes/events/bb-on-init/bb-on-init.component';
import { BbOnOverlapComponent } from './blueprint-boxes/events/bb-on-overlap/bb-on-overlap.component';
import { BbWrappingComponent } from './blueprint-boxes/bb-wrapping/bb-wrapping.component';
import { BbCountdownComponent } from './blueprint-boxes/actions/bb-countdown/bb-countdown.component';
import { BbSwitchIntegerComponent } from './blueprint-boxes/operators/bb-switch-integer/bb-switch-integer.component';
import { BbGetActorsComponent } from './blueprint-boxes/actions/bb-get-actors/bb-get-actors.component';

@NgModule({
    declarations: [
        BlueprintsInterfaceComponent,
        DraggableDirective,
        DroppableDirective,
        BbOnInitComponent,
        BbOnOverlapComponent,
        BbWrappingComponent,
        BbCountdownComponent,
        BbSwitchIntegerComponent,
        BbGetActorsComponent,
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
