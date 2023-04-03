import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private usuarioService: UsuarioService,
    private router: Router
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

  public logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    if(this.sub)
      this.sub.unsubscribe();
  }

}
