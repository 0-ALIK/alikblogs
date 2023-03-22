import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from 'src/app/shared/components/error/error.component';
import { ConfigComponent } from './pages/config/config.component';
import { CreateComponent } from './pages/create/create.component';
import { EditorComponent } from './pages/editor/editor.component';
import { VerUsuarioComponent } from './pages/ver-usuario/ver-usuario.component';
import { PerfilComponent } from './perfil.component';

const routes: Routes = [
  {
    path: '',
    component: PerfilComponent,
    children: [
      {
        path: ':id',
        component: VerUsuarioComponent
      },
      {
        path: 'config',
        component: ConfigComponent,
      },
      {
        path: 'create',
        component: CreateComponent
      },
      {
        path: 'editor/:id',
        component: EditorComponent
      },
      {
        path: '',
        redirectTo: '/home/usuarios',
        pathMatch: 'full'
      },
      {
        path: '**',
        component: ErrorComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerfilRoutingModule { }
