import { Component } from '@angular/core';
import { UsuarioService } from './services/usuario.service';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>

    <div class="modal modal-open" id="my-modal-2" *ngIf="usuarioService.authError">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Error en la autenticación</h3>
        <p class="py-4">Tal parece que tu Token ha expirado o por alguna razón ya no es valido, vuelve a iniciar sesión</p>
        <div class="modal-action">
        <a routerLink="/auth/login" (click)="usuarioService.authError = false" class="btn">Iniciar sesión</a>
        </div>
      </div>
    </div>
  `
})
export class AppComponent {

  constructor(
    public usuarioService: UsuarioService
  ) {}
}
