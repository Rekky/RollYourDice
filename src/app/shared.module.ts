import {NgModule} from '@angular/core';
import {EnumToArrayPipe} from './pipes/enum-to-array-pipe';
import {NotificationComponent} from './components/notification/notification.component';
import {CharacterSheetComponent} from './components/character-sheet/character-sheet.component';
import {CsHeaderComponent} from './components/character-sheet/cs-header/cs-header.component';
import {CsAttributesComponent} from './components/character-sheet/cs-attributes/cs-attributes.component';
import {CsSavingThrowsComponent} from './components/character-sheet/cs-saving-throws/cs-saving-throws.component';
import {CsSkillsComponent} from './components/character-sheet/cs-skills/cs-skills.component';
import {AssetComponent} from './components/asset/asset.component';
import {UploadInputComponent} from './components/upload-input/upload-input.component';
import {EditGameDataComponent} from './components/edit-game-data/edit-game-data.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {LauncherRoutingModule} from './pages/launcher/launcher-routing.module';
import {MatDialogModule} from '@angular/material/dialog';
import {SafePipe} from './pipes/safe-pipe';
import { SearchGameComponent } from './components/search-game/search-game.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { CustomModalComponent } from './components/custom-modal/custom-modal.component';
import {SidebarCustomComponent} from './components/sidebar-custom/sidebar-custom.component';
import { MiniMapComponent } from './components/mini-map/mini-map.component';
import {MiniMenuComponent} from './components/mini-menu/mini-menu.component';
import {CustomWizardActorComponent} from './components/custom-wizard-actor/custom-wizard-actor.component';
import { CustomListComponent } from './components/custom-list/custom-list.component';
import { FormErrorsComponent } from './components/form-errors/form-errors.component';
import {TutorialComponent} from './components/tutorial/tutorial.component';


@NgModule({
    declarations: [
        EnumToArrayPipe,
        SafePipe,
        NotificationComponent,
        CharacterSheetComponent,
        CsHeaderComponent,
        CsAttributesComponent,
        CsSavingThrowsComponent,
        CsSkillsComponent,
        AssetComponent,
        UploadInputComponent,
        EditGameDataComponent,
        SearchGameComponent,
        UserListComponent,
        CustomModalComponent,
        SidebarCustomComponent,
        MiniMapComponent,
        MiniMenuComponent,
        CustomWizardActorComponent,
        CustomListComponent,
        FormErrorsComponent,
        CustomListComponent,
        TutorialComponent,
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        LauncherRoutingModule,
        ReactiveFormsModule,
        MatDialogModule,
    ],
    exports: [
        EnumToArrayPipe,
        SafePipe,
        NotificationComponent,
        CharacterSheetComponent,
        CsHeaderComponent,
        CsAttributesComponent,
        CsSavingThrowsComponent,
        CsSkillsComponent,
        AssetComponent,
        UploadInputComponent,
        EditGameDataComponent,
        CustomModalComponent,
        SidebarCustomComponent,
        MiniMapComponent,
        MiniMenuComponent,
        CustomWizardActorComponent,
        CustomListComponent,
        FormErrorsComponent,
        CustomListComponent,
        TutorialComponent,
    ],
})

export class SharedModule { }
