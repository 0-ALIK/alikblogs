import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService } from './services/blog.service';
import { UsuarioService } from './services/usuario.service';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>

    <div class="modal modal-open" *ngIf="usuarioService.authError">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Error en la autenticación</h3>
        <p class="py-4">Tal parece que tu Token ha expirado o por alguna razón ya no es valido, vuelve a iniciar sesión</p>
        <div class="modal-action">
        <a routerLink="/auth/login" (click)="usuarioService.authError = false" class="btn">Iniciar sesión</a>
        </div>
      </div>
    </div>

    <div class="modal modal-open" *ngIf="blogService.eliminarConfirm">
      <div class="modal-box">
        <h3 class="text-lg">¿Realmente quieres eliminar tu blog <span class="font-bold">{{blogService.blogPorEliminar.titulo}}</span>?</h3>
        <p class="py-4">Escribe en el input "<span class="font-bold">{{blogService.blogPorEliminar.titulo}}</span>" para proceder:</p>
        <div class="modal-action">
          <label for="my-modal-3" class="btn btn-sm btn-circle absolute right-2 top-2" (click)="cerrarModalConfirm()">✕</label>

          <input autocomplete="off" type="text" [(ngModel)]="value" placeholder="Type here" class="input w-full input-bordered">

          <button class="btn" [disabled]="value !== blogService.blogPorEliminar.titulo" (click)="eliminarBlog()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `
})
export class AppComponent {

  public value: string = '';

  constructor(
    public usuarioService: UsuarioService,
    public blogService: BlogService,
    private router: Router
  ) {}

  public eliminarBlog(): void {
    this.value = '';

    this.blogService.eliminarBlog().subscribe({
      next: resp => {
        this.router.navigate(['/home/blogs']);
        this.blogService.eliminarConfirm = false;
      }
    });
  }

  public cerrarModalConfirm(): void {
    this.blogService.eliminarConfirm = false;
    this.value = '';
  }
}
