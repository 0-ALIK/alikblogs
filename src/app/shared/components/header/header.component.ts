import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/interfaces/responses.interface';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnDestroy, OnInit {

  private sub!: Subscription;

  public usuarioAuth!: Usuario;

  public isLoading: boolean = true;

  constructor (
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    if(this.usuarioService.usuarioAuth) {
      this.usuarioAuth = this.usuarioService.usuarioAuth;
      this.isLoading = false;
      return;
    }

    const token = localStorage.getItem('token') || '';
    this.sub = this.usuarioService.verificarAuth(token).subscribe({
      next: resp => {
        if(resp.usuario)
          this.usuarioAuth = resp.usuario
        this.isLoading = false;
      },
      error: error => console.log( error )
    });
  }

  ngOnDestroy(): void {
    if(this.sub)
      this.sub.unsubscribe();
  }

}
