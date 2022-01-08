import {NgModule} from '@angular/core';
import {MyAdventuresComponent} from './my-adventures/my-adventures.component';
import {MainMenuComponent} from './menu/main-menu.component';
import {LauncherComponent} from './launcher.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {LauncherRoutingModule} from './launcher-routing.module';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared.module';


@NgModule({
    declarations: [
        LauncherComponent,
        MyAdventuresComponent,
        MainMenuComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        LauncherRoutingModule,
        ReactiveFormsModule,
        MatDialogModule,
        SharedModule
    ],
})

export class LauncherModule { }
