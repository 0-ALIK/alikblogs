import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../interfaces/responses.interface'

interface IAuth {
  usuario: Usuario | undefined,
  tokenRenovado?: string,
  token?: string
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private host: string = environment.host;

  public authError: boolean = false;

  public usuarioAuth!: Usuario

  constructor(private http: HttpClient) {}

  public getUsuarios(skip: number): Observable<Response> {
    const params = new HttpParams()
      .set('limit', 10)
      .set('skip', skip);

    return this.http.get<Response>(this.host+'/usuario/all', {params});
  }

  public loginUsuario(correo: string, pass: string): Observable<IAuth> {
    return this.http.post<IAuth>(this.host+'/auth/login', {correo, pass}).pipe(
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
        if(resp.usuario)
          this.usuarioAuth = resp.usuario;
      }),
      catchError( error => {
        this.authError = true;
        return of({usuario: undefined});
      })
    );
  }

}
