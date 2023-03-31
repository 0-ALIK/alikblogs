import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Blog, Social, Usuario } from 'src/app/interfaces/responses.interface';
import { BlogService } from 'src/app/services/blog.service';
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

  public botonDeshabilitado: boolean = false;

  public isNoPub: boolean = false;

  public blogs!: Blog[];

  public blogsNoPub!: Blog[];

  get siguiendo(): boolean {
    const siguiendo = this.social.seguidores.filter(usuario => usuario._id === this.usuarioAuth._id);
    return (siguiendo.length !== 0) ? true : false;
  }

  constructor(
    private activateRoute: ActivatedRoute,
    private usuarioService: UsuarioService,
    private blogService: BlogService,
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
            this.getBlogsUsuario();
            if(this.usuario._id === this.usuarioAuth._id)
              this.getBlogsUsuarioNoPub();
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
      this.social = this.usuarioService.socialAuth;
      return;
    }

    const sub = this.usuarioService.getSocialById(this.usuario._id).subscribe({
      next: resp => {
        this.social = resp;
      }
    });

    this.subs.push( sub );
  }

  public seguirDejarSeguir(): void {
    this.botonDeshabilitado = true;

    if(this.siguiendo) {
      const sub1 = this.usuarioService.dejarSeguirUsuario(this.usuario._id).subscribe({
        next: resp => {
          if(resp.tokenRenovado)
            localStorage.setItem('token', resp.tokenRenovado);
          this.social.seguidores = this.social.seguidores.filter(u => u._id !== this.usuarioAuth._id);
          this.usuarioService.socialAuth.seguidos = this.usuarioService.socialAuth.seguidos.filter(u => {
            return u._id !== this.usuario._id;
          });
          this.botonDeshabilitado = false;
        }
      });

      this.subs.push( sub1 );
      return;
    }

    const sub2 = this.usuarioService.seguirUsuario(this.usuario._id).subscribe({
      next: resp => {
        if(resp.tokenRenovado)
          localStorage.setItem('token', resp.tokenRenovado);
        this.social.seguidores.unshift( this.usuarioAuth );
        this.usuarioService.socialAuth.seguidos.unshift( this.usuario );
        this.botonDeshabilitado = false;
      }
    });

    this.subs.push( sub2 );
  }

  public eliminarBlogPrev(blog: Blog): void {
    this.blogService.blogPorEliminar = blog;
    this.blogService.eliminarConfirm = true;
  }

  public getBlogsUsuario(): void {
    const sub = this.blogService.getBlogsByUser(this.usuario._id).subscribe({
      next: resp => {
        this.blogs = resp.blogs;
      }
    });

    this.subs.push( sub );
  }

  public getBlogsUsuarioNoPub(): void {
    const sub = this.blogService.getBlogsNoPubByUser(this.usuario._id).subscribe({
      next: resp => {
        if(resp.tokenRenovado)
          localStorage.setItem('token', resp.tokenRenovado);
        this.blogsNoPub = resp.blogs;
      }
    });

    this.subs.push( sub );
  }

  public ngOnDestroy(): void {
    if(this.subs && this.subs.length !== 0)
      this.subs.forEach(sub => sub.unsubscribe());
  }

}
