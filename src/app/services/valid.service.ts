import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
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
  ) {}

  public validExtension(formControl: FormControl): ValidationErrors | null {
    if(!formControl.value) {
      return null;
    }

    const value: string[] = formControl.value.split('.');
    const extension = value[value.length - 1].toLowerCase();
    const extensiones: string[] = ['png', 'jpg', 'gif'];

    if(!extensiones.includes(extension) && extension.length !== 0) {
      return {
        extension: true
      }
    }
    return null;
  }

  public notEmpty(FormGroup: FormGroup): ValidationErrors | null {
    let hayValor: boolean = false;

    Object.keys( FormGroup.controls ).forEach(key => {
      const control = FormGroup.get(key);

      if(control?.value && control.value.length > 0) {
        hayValor = true;
      }
    });

    if(hayValor) return null;

    return {formEmpty: true}
  }

  public existe(param: string): AsyncValidatorFn {

    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const params = new HttpParams().set(param, control.value);

      return this.http.get<Response>(this.host+'/usuario/find', {params}).pipe(
        map((resp) => resp.usuarios.length !== 0 ? {existe: true} : null)
      );

    };
  }



}
