import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UsuarioService } from './usuario.service';


interface IUploadResponse {
  path: string,
  tokenRenovado: string
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private host: string = environment.host;

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService
  ) { }

  public subirImagen(formData: FormData): Observable<IUploadResponse> {
    const headers = new HttpHeaders()
      .set('x-token', localStorage.getItem('token') || '')
      .set('enctype', 'multipart/form-data');

    return this.http.post<IUploadResponse>(this.host+'/upload/subir', formData, {headers}).pipe(
      catchError( (error: HttpErrorResponse) => {
        if(error.status === 401) {
          this.usuarioService.authError = true;
        }
        return of();
      })
    );
  }

  public borrarImagen(src: string): Observable<IUploadResponse> {
    const headers = new HttpHeaders()
      .set('x-token', localStorage.getItem('token') || '')

    const body = { src };

    return this.http.delete<IUploadResponse>(this.host+'/upload/borrar', {headers, body}).pipe(
      catchError( (error: HttpErrorResponse) => {
        if(error.status === 401) {
          this.usuarioService.authError = true;
        }
        return of();
      })
    );
  }

}
