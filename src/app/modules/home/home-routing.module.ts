import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from 'src/app/shared/components/error/error.component';
import { HomeComponent } from './home.component';
import { AboutComponent } from './pages/about/about.component';
import { BlogsComponent } from './pages/blogs/blogs.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { VerBlogComponent } from './pages/ver-blog/ver-blog.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'blogs',
        component: BlogsComponent,
      },
      {
        path: 'usuarios',
        component: UsuariosComponent
      },
      {
        path: 'about',
        component: AboutComponent,
      },
      {
        path: 'blogs/:id',
        component: VerBlogComponent
      },
      {
        path: 'perfil',
        loadChildren: () => import('../perfil/perfil.module').then(m => m.PerfilModule)
      },
      {
        path: '',
        redirectTo: 'blogs',
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
export class HomeRoutingModule { }
