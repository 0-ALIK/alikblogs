import { Component, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnDestroy{

  @ViewChild('formulario')
  public formulario!: NgForm;

  public isLoading: boolean = false;

  public error: boolean = false;

  public sub!: Subscription

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  public enviarFormulario(): void {
    this.isLoading = true
    const { correo, pass } = this.formulario.value;
    this.sub = this.usuarioService.loginUsuario(correo, pass).subscribe({
      next: resp => {
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
      error: error => {
        this.error = true;
        this.isLoading = false;
      }
    })
    this.formulario.reset();
  }

  public validarCampo(campo: string): boolean {
    return this.formulario?.controls[campo]?.invalid
      && this.formulario?.controls[campo]?.touched;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
