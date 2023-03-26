import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ValidService } from 'src/app/services/valid.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnDestroy {

  public isLoading: boolean = false;

  private sub!: Subscription;

  public error: boolean = false;

  public formulario: FormGroup = this.formBuilder.group({
    nombre: ['',
      [Validators.required, Validators.pattern(this.validService.nombreRE),
      Validators.minLength(2), Validators.maxLength(20)], this.validService.existe('nombre')],
    correo: ['', [Validators.required, Validators.email], this.validService.existe('correo')],
    pass: ['',
      [Validators.required, Validators.pattern(this.validService.passRE),
      Validators.minLength(8)]],
    passc: ['', [Validators.required]]
  });

  public mensajeError(campo: string, errorType: string) {
    const field = this.formulario.get(campo);

    if(field?.errors?.[errorType] && field?.touched){
      return true;
    }
    return false;
  }

  constructor(
    private usuarioService: UsuarioService,
    private validService: ValidService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  public validarCampo(campo: string): boolean {
    return this.formulario?.controls[campo]?.invalid
    && this.formulario?.controls[campo]?.touched;
  }


  public enviarFormulario(): void {
    this.isLoading = true;
    const { passc, ...values } = this.formulario.value;
    this.formulario.reset();

    this.sub = this.usuarioService.registrarUsuario(values).subscribe({
      next: resp => {
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
      error: error => {
        this.isLoading = false;
        this.error = true;
      }
    });
  }


  ngOnDestroy(): void {
    if(this.sub)
      this.sub.unsubscribe();
  }

}
