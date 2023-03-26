import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AsideComponent } from './components/aside/aside.component';
import { ErrorComponent } from './components/error/error.component';
import { RouterModule } from '@angular/router';
import { QuillEditorComponent } from './components/quill-editor/quill-editor.component';
import { HttpClientModule } from '@angular/common/http';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { TiempoPipe } from './pipes/tiempo.pipe';



@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    AsideComponent,
    ErrorComponent,
    QuillEditorComponent,
    PaginatorComponent,
    TiempoPipe,
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    AsideComponent,
    ErrorComponent,
    QuillEditorComponent,
    PaginatorComponent,
    TiempoPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule
  ]
})
export class SharedModule { }
