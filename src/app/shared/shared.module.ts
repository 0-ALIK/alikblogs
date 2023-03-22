import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AsideComponent } from './components/aside/aside.component';
import { ErrorComponent } from './components/error/error.component';



@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    AsideComponent,
    ErrorComponent,
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    AsideComponent,
    ErrorComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
