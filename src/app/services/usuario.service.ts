import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Social, Usuario } from '../interfaces/responses.interface'

interface IAuth {
  usuario: Usuario | undefined,
  tokenRenovado?: string,
  token?: string
}

interface IUsuario {
  usuario: Usuario,
  Usuarios: Usuario[],
  cantidad: number
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private host: string = environment.host;

  public authError: boolean = false;

  public usuarioAuth!: Usuario;

  public socialAuth!: Social;

  constructor(private http: HttpClient) {}

  public getUsuarios(skip: number): Observable<Response> {
    const params = new HttpParams()
      .set('limit', 10)
      .set('skip', skip);

    return this.http.get<Response>(this.host+'/usuario/all', {params});
  }

  public GetUsuarioById(id: string): Observable<IUsuario> {
    return this.http.get<IUsuario>(this.host+'/usuario/'+id);
  }

  public loginUsuario(correo: string, pass: string): Observable<IAuth> {
    return this.http.post<IAuth>(this.host+'/auth/login', {correo, pass}).pipe(
      map( resp => {
        if (resp.token)
          localStorage.setItem('token', resp.token);
        return resp;
      }),
      tap( resp => {
        if(resp.usuario) {
          this.usuarioAuth = resp.usuario;
          this.definirSocial();
        }
      })
    );
  }

  public registrarUsuario(usuario: Usuario): Observable<IAuth> {
    return this.http.post<IAuth>(this.host+'/usuario', usuario).pipe(
      map( resp => {
        if (resp.token)
          localStorage.setItem('token', resp.token);
        return resp;
      }),
      tap( resp => {
        if(resp.usuario)
          this.usuarioAuth = resp.usuario;
      })
    );
  }

  public verificarAuth(token: string): Observable<IAuth> {
    const headers = new HttpHeaders().set('x-token', token);

    return this.http.get<IAuth>(this.host+'/auth', {headers}).pipe(
      tap( resp => {
        if(resp.usuario) {
          this.usuarioAuth = resp.usuario;
          this.definirSocial();
        }
      }),
      catchError( error => {
        this.authError = true;
        return of({usuario: undefined});
      })
    );
  }

  // Obtener seguidores y seguidos
  public getSocialById(id: string): Observable<Social> {
    return this.http.get<Social>(this.host+'/seguidor/social/'+id);
  }

  public seguirUsuario(id: string): Observable<IAuth> {
    const headers = new HttpHeaders().set('x-token', localStorage.getItem('token') || '');
    return this.http.post<IAuth>(this.host+'/seguidor/seguir/'+id, {}, {headers}).pipe(
      catchError( (error: HttpErrorResponse) => {
        if(error.status === 401) {
          this.authError = true;
        }
        return of();
      })
    );
  }

  public dejarSeguirUsuario(id: string): Observable<IAuth> {
    const headers = new HttpHeaders().set('x-token', localStorage.getItem('token') || '');
    return this.http.delete<IAuth>(this.host+'/seguidor/unfollow/'+id, {headers}).pipe(
      catchError( (error: HttpErrorResponse) => {
        if(error.status === 401) {
          this.authError = true;
        }
        return of();
      })
    );
  }

  private definirSocial(): void {
    if(this.usuarioAuth._id) {
      this.getSocialById(this.usuarioAuth._id).subscribe({
        next: resp => {
          this.socialAuth = resp;
        }
      })
    }
  }

}
