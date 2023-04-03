import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/interfaces/responses.interface';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ValidService } from 'src/app/services/valid.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styles: [
  ]
})
export class ConfigComponent implements OnInit, OnDestroy {

  public formulario: FormGroup = this.formBuilder.group({
    about: ['', [Validators.minLength(2), Validators.maxLength(200)]],
    img: [null, [this.validService.validExtension]]
  }, {
    validators: [this.validService.notEmpty]
  });

  public isLoading: boolean = false;

  private img!: File | null;

  public subs: Subscription[] = [];

  public usuarioAuth!: Usuario;

  constructor(
    private formBuilder: FormBuilder,
    private validService: ValidService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.getUsuarioAuth();
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

  public updateUsuario(): void {
    this.isLoading = true;

    const data = new FormData();

    if(this.formulario.get('about')?.value && this.formulario.get('about')?.value.length > 0)
      data.append('about', this.formulario.get('about')?.value);
    if(this.img)
      data.append('img', this.img);

    this.formulario.reset();

    const sub = this.usuarioService.updateUsuario(data).subscribe({
      next: resp => {
        if(resp.tokenRenovado)
          localStorage.setItem('token', resp.tokenRenovado);

        if(resp.usuario)
          this.usuarioService.usuarioAuth = resp.usuario;

        this.isLoading = false;
      }
    });

    this.subs.push( sub );
  }

  public mensajeError(campo: string, errorType: string) {
    const field = this.formulario.get(campo);
    if(field?.errors?.[errorType] && field?.touched){
      return true;
    }
    return false;
  }

  public seleccionarArchivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if(file) {
      this.img = file;
      return;
    }
    this.img = null;
  }

  public ngOnDestroy(): void {
    if(this.subs && this.subs.length !== 0)
      this.subs.forEach( sub => sub.unsubscribe() );
  }

}
