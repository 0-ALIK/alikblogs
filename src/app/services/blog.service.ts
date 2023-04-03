import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Blog, Comentario, Usuario } from '../interfaces/responses.interface';
import { UsuarioService } from './usuario.service';

interface IBlogResponse {
  blog: Blog,
  blogs: Blog[],
  tokenRenovado: string,
  cantidad: number
}

interface IComentario {
  comentarios: Comentario[],
  comentario: Comentario,
  tokenRenovado: string,
  cantidad: number
}

interface ILikeUsuarios {
  usuarios: Usuario[],
  tokenRenovado: string,
  cantidad: number
}


@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private host: string = environment.host;

  public eliminarConfirm: boolean = false;

  public blogPorEliminar!: Blog;

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService) { }

  public getBlogs(skip: number): Observable<IBlogResponse> {
    const params = new HttpParams()
      .set('limit', 8)
      .set('skip', skip);
    return this.http.get<IBlogResponse>(this.host+'/blog/all', {params});
  }

  public getBlogByID(id: string): Observable<IBlogResponse> {
    return this.http.get<IBlogResponse>(this.host+'/blog/'+id);
  }

  public eliminarBlog(): Observable<IBlogResponse> {
    const headers = new HttpHeaders().set('x-token', localStorage.getItem('token') || '');
    return this.http.delete<IBlogResponse>(this.host+'/blog/'+this.blogPorEliminar._id, {headers}).pipe(
      catchError( (error: HttpErrorResponse) => {
        if(error.status === 401) {
          this.usuarioService.authError = true;
          this.eliminarConfirm = false;
        }
        return of();
      })
    );
  }

  public getComentarios(id: string): Observable<IComentario> {
    return this.http.get<IComentario>(this.host+'/comentario/all/'+id);
  }

  public dejarComentario(id: string, contenido: string): Observable<IComentario> {
    const headers = new HttpHeaders().set('x-token', localStorage.getItem('token') || '');
    return this.http.post<IComentario>(this.host+'/comentario/'+id, {contenido}, {headers}).pipe(
      catchError( (error: HttpErrorResponse) => {
        if(error.status === 401) {
          this.usuarioService.authError = true;
        }
        return of();
      })
    );
  }

  public borrarComentario(id: string): Observable<IComentario> {
    const headers = new HttpHeaders().set('x-token', localStorage.getItem('token') || '');
    return this.http.delete<IComentario>(this.host+'/comentario/'+id, {headers}).pipe(
      catchError( (error: HttpErrorResponse) => {
        if(error.status === 401) {
          this.usuarioService.authError = true;
        }
        return of();
      })
    );
  }

  public getBlogsByUser(id: string): Observable<IBlogResponse> {
    return this.http.get<IBlogResponse>(this.host+'/blog/all/'+id);
  }

  public getBlogsNoPubByUser(id: string): Observable<IBlogResponse> {
    const headers = new HttpHeaders().set('x-token', localStorage.getItem('token') || '');
    return this.http.get<IBlogResponse>(this.host+'/blog/no/publicados', {headers}).pipe(
      catchError( (error: HttpErrorResponse) => {
        if(error.status === 401) {
          this.usuarioService.authError = true;
        }
        return of();
      })
    );
  }

  public getLikesBlog(id: string): Observable<ILikeUsuarios> {
    return this.http.get<ILikeUsuarios>(this.host+'/like/usuario/'+id);
  }

  public darLike(id: string): Observable<ILikeUsuarios> {
    const headers = new HttpHeaders().set('x-token', localStorage.getItem('token') || '');

    return this.http.post<ILikeUsuarios>(this.host+'/like/'+id, {}, {headers}).pipe(
      catchError( (error: HttpErrorResponse) => {
        if(error.status === 401) {
          this.usuarioService.authError = true;
        }
        return of();
      })
    );
  }

  public quitarLike(id: string): Observable<ILikeUsuarios> {
    const headers = new HttpHeaders().set('x-token', localStorage.getItem('token') || '');
    return this.http.delete<ILikeUsuarios>(this.host+'/like/'+id, {headers}).pipe(
      catchError( (error: HttpErrorResponse) => {
        if(error.status === 401) {
          this.usuarioService.authError = true;
        }
        return of();
      })
    );
  }

  public crearBlogBorrador(data: FormData): Observable<IBlogResponse> {
    const headers = new HttpHeaders()
      .set('x-token', localStorage.getItem('token') || '')
      .set('enctype', 'multipart/form-data');

    return this.http.post<IBlogResponse>(this.host+'/blog', data, {headers}).pipe(
      catchError( (error: HttpErrorResponse) => {
        if(error.status === 401) {
          this.usuarioService.authError = true;
        }
        return of();
      })
    );
  }

  public updateBlog(id: string, data: FormData): Observable<IBlogResponse> {
    const headers = new HttpHeaders()
      .set('x-token', localStorage.getItem('token') || '')
      .set('enctype', 'multipart/form-data');

    return this.http.put<IBlogResponse>(this.host+'/blog/'+id, data, {headers}).pipe(
      catchError( (error: HttpErrorResponse) => {
        if(error.status === 401) {
          this.usuarioService.authError = true;
        }
        return of();
      })
    );
  }

  public getBlogByIdAuth(id: string): Observable<IBlogResponse> {
    const headers = new HttpHeaders()
      .set('x-token', localStorage.getItem('token') || '');

    return this.http.get<IBlogResponse>(this.host+'/blog/auth/'+id, {headers}).pipe(
      catchError( (error: HttpErrorResponse) => {
        if(error.status === 401) {
          this.usuarioService.authError = true;
        }
        return of();
      })
    );
  }

}
