import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfilRoutingModule } from './perfil-routing.module';
import { PerfilComponent } from './perfil.component';
import { ConfigComponent } from './pages/config/config.component';
import { EditorComponent } from './pages/editor/editor.component';
import { CreateComponent } from './pages/create/create.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { VerUsuarioComponent } from './pages/ver-usuario/ver-usuario.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PerfilComponent,
    ConfigComponent,
    EditorComponent,
    CreateComponent,
    VerUsuarioComponent
  ],
  imports: [
    CommonModule,
    PerfilRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class PerfilModule { }
