import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { BlogsComponent } from './pages/blogs/blogs.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { AboutComponent } from './pages/about/about.component';
import { VerBlogComponent } from './pages/ver-blog/ver-blog.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    HomeComponent,
    BlogsComponent,
    UsuariosComponent,
    AboutComponent,
    VerBlogComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule
  ]
})
export class HomeModule { }
