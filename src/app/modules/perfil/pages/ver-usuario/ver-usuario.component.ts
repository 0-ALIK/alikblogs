import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Social, Usuario } from 'src/app/interfaces/responses.interface';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-ver-usuario',
  templateUrl: './ver-usuario.component.html',
  styles: [
  ]
})
export class VerUsuarioComponent implements OnInit, OnDestroy {

  private subs: Subscription[]  = [];

  public usuarioAuth!: Usuario;

  public usuario!: Usuario;

  public social!: Social;

  constructor(
    private activateRoute: ActivatedRoute,
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  public ngOnInit(): void {
    const sub = this.activateRoute.params.subscribe({
      next: ({id}) => {
        this.usuarioService.GetUsuarioById(id).subscribe({
          next: resp => {
            this.usuario = resp.usuario;
            this.getUsuarioAuth();
            this.obtenerSocial();
          },
          error: error => this.router.navigate(['/home/perfil/error/404'])
        });
      }
    });

    this.getUsuarioAuth();

    this.subs.push(sub);
  }

  private getUsuarioAuth(): void {
    if(this.usuarioService.usuarioAuth) {
      this.usuarioAuth = this.usuarioService.usuarioAuth;
      return;
    }

    const token = localStorage.getItem('token') || '';
    const subusuario = this.usuarioService.verificarAuth(token).subscribe({
      next: resp => {
        if(resp.usuario)
          this.usuarioAuth = resp.usuario;
      },
      error: error => console.log( error )
    });

    this.subs.push(subusuario);
  }

  private obtenerSocial(): void {
    if(this.usuario._id === this.usuarioAuth._id) {
      this.social = {
        seguidores: this.usuarioService.seguidoresAuth,
        seguidos: this.usuarioService.seguidosAuth
      }
      return;
    }

    const sub = this.usuarioService.getSocialById(this.usuario._id).subscribe({
      next: resp => {
        this.social = {
          seguidores: resp.seguidores,
          seguidos: resp.seguidos
        }
      }
    });

    this.subs.push( sub );
  }

  public ngOnDestroy(): void {
    if(this.subs && this.subs.length !== 0)
      this.subs.forEach(sub => sub.unsubscribe());
  }
}
