import { Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Blog, Comentario, Usuario } from 'src/app/interfaces/responses.interface';
import { BlogService } from 'src/app/services/blog.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-ver-blog',
  templateUrl: './ver-blog.component.html',
  styles: [
  ]
})
export class VerBlogComponent implements OnInit, OnDestroy {

  private subs: Subscription[] = [];

  public blog!: Blog;

  public usuarioAuth!: Usuario;

  public disabledBoton: boolean = false;

  private observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 1.0
  };

  @ViewChild('formulario')
  public formulario!: NgForm

  @ViewChild('likes')
  private likesComponentRef!: ElementRef<HTMLElement>;
  private observeLike!: IntersectionObserver;
  private likesVisto: boolean = false;
  public likeCantidad: number = 0;
  public likeUsuarios!: Usuario[];

  @ViewChild('comentarios')
  private comentariosComponentRef!: ElementRef<HTMLElement>;
  private observeComentario!: IntersectionObserver;
  private comentarioVisto: boolean = false;
  public comentariosList!: Comentario[];
  public comentCantidad: number = 0;

  get usuarioDioLike(): boolean {
    const dioLike = this.likeUsuarios.filter(usuario => usuario._id === this.usuarioAuth._id);
    return dioLike.length !== 0;
  }

  get likeList(): Usuario[] {
    if(this.likeUsuarios.length < 5)
      return this.likeUsuarios;
    return this.likeUsuarios.slice(0, 4);
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService,
    private blogService: BlogService,
    private router: Router) { }

  public ngOnInit(): void {

    const sub = this.activatedRoute.params.subscribe({
      next: ({id}) => {
        const subblog = this.blogService.getBlogByID(id).subscribe({
          next: resp => {
            this.blog = resp.blog;
            this.definirIntersectionObservers();
          },
          error: error => this.router.navigate(['/home/error'])
        });

        this.subs.push(subblog);
      }
    });

    this.subs.push( sub );

    this.getUsuarioAuth();
  }

  public darQuitarLike(): void {
    this.disabledBoton = true;

    if(this.usuarioDioLike) {
      const subquitar = this.blogService.quitarLike(this.blog._id).subscribe({
        next: resp => {
          if(resp.tokenRenovado)
            localStorage.setItem('token', resp.tokenRenovado);
          this.likeUsuarios = this.likeUsuarios.filter(usuario => usuario._id !== this.usuarioAuth._id);
          this.likeCantidad -= 1;
          this.disabledBoton = false;
        }
      });
      this.subs.push(subquitar);
      return;
    }

    const subdarlike = this.blogService.darLike(this.blog._id).subscribe({
      next: resp => {
        if(resp.tokenRenovado)
          localStorage.setItem('token', resp.tokenRenovado);
        this.likeCantidad += 1;
        this.likeUsuarios.unshift( this.usuarioAuth );
        this.disabledBoton = false;
      },
      error: error => console.error( error )
    });

    this.subs.push( subdarlike );
  }

  public comentar(): void {
    const { contenido } = this.formulario.value;
    console.log(contenido);
    const subdejarComent = this.blogService.dejarComentario(this.blog._id, contenido).subscribe({
      next: resp => {
        if(resp.tokenRenovado)
            localStorage.setItem('token', resp.tokenRenovado);
        const comentario: Comentario = {
          _id: resp.comentario._id,
          fecha: resp.comentario.fecha,
          contenido: contenido,
          usuario: {
            _id: this.usuarioAuth._id,
            nombre: this.usuarioAuth.nombre,
            img: this.usuarioAuth.img
          }
        };
        this.comentariosList.unshift( comentario );
      }
    });

    this.subs.push(subdejarComent);
  }

  public borrarComentario(id: string): void {
    const subborrar = this.blogService.borrarComentario(id).subscribe({
      next: resp => {
        this.comentariosList = this.comentariosList.filter(coment => coment._id !== id);
        this.comentCantidad -= 1;
      }
    });

    this.subs.push( subborrar );
  }

  public eliminarBlogPrev(): void {
    console.log('entre');
    this.blogService.blogPorEliminar = this.blog;
    this.blogService.eliminarConfirm = true;
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

  private onIntersectionComentario(entries: IntersectionObserverEntry[]) {
    entries.forEach( entry => {
      if(entry.isIntersecting && !this.comentarioVisto) {
        const subcoment = this.blogService.getComentarios(this.blog._id).subscribe({
          next: resp => {
            console.log(resp.comentarios);
            this.comentariosList = resp.comentarios;
            this.comentCantidad = resp.cantidad
          }
        });
        this.subs.push( subcoment );
        this.comentarioVisto = true;
      }
    });
  }

  private onIntersectionLike(entries: IntersectionObserverEntry[]) {
    entries.forEach( entry => {
      if(entry.isIntersecting && !this.likesVisto) {
        const sublike = this.blogService.getLikesBlog(this.blog._id).subscribe({
          next: resp => {
            this.likeCantidad = resp.cantidad;
            this.likeUsuarios = resp.usuarios;
          }
        });
        this.subs.push( sublike );
        this.likesVisto = true;
      }
    });
  }

  private definirIntersectionObservers(): void {
    this.observeComentario = new IntersectionObserver(this.onIntersectionComentario.bind(this), this.observerOptions);
    this.observeLike = new IntersectionObserver(this.onIntersectionLike.bind(this), this.observerOptions);

    this.observeComentario.observe( this.comentariosComponentRef.nativeElement );
    this.observeLike.observe( this.likesComponentRef.nativeElement );
  }

  public ngOnDestroy(): void {
    if(this.subs && this.subs.length !== 0)
      this.subs.forEach(sub => sub.unsubscribe());
  }

}
