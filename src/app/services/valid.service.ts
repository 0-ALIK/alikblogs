import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response } from '../interfaces/responses.interface';

@Injectable({
  providedIn: 'root'
})
export class ValidService {

  private host: string = environment.host;

  public passRE = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()_+\-=\[\]{};':"\\|,.<>\/?])/;

  public nombreRE = /^[a-zA-Z0-9_]+$/;

  constructor(
    private http: HttpClient
  ) { }

  public existe(param: string): AsyncValidatorFn {

    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const params = new HttpParams().set(param, control.value);

      return this.http.get<Response>(this.host+'/usuario/find', {params}).pipe(
        map((resp) => resp.usuarios.length !== 0 ? {existe: true} : null)
      );

    };
  }



}