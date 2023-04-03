import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BlogService } from 'src/app/services/blog.service';
import { ValidService } from 'src/app/services/valid.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styles: [
  ]
})
export class CreateComponent implements OnDestroy {

  public subs: Subscription[] = [];

  public isLoading: boolean = false;

  private portada!: File | null;

  public formulario: FormGroup = this.formBuilder.group({
    titulo: ['', [Validators.required,
      Validators.maxLength(50), Validators.minLength(2)]],
    portada: [null, [this.validService.validExtension]]
  });

  constructor(
    private formBuilder: FormBuilder,
    private validService: ValidService,
    private blogService: BlogService,
    private router: Router
  ) { }

  public mensajeError(campo: string, errorType: string) {
    const field = this.formulario.get(campo);
    if(field?.errors?.[errorType] && field?.touched){
      return true;
    }
    return false;
  }

  public crearBorrador(): void {
    this.isLoading = true;

    const data = new FormData();
    data.append('titulo', this.formulario.get('titulo')?.value);
    if(this.portada)
      data.append('portada', this.portada);

    this.formulario.reset();

    const sub = this.blogService.crearBlogBorrador(data).subscribe({
      next: resp => {
        this.isLoading = false;
        this.router.navigate(['/home/perfil/editor', resp.blog._id]);
      },
      error: error => console.error( error )
    });

    this.subs.push( sub );
  }

  public seleccionarArchivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if(file) {
      this.portada = file;
      return;
    }
    this.portada = null;
  }

  ngOnDestroy(): void {
    if(this.subs && this.subs.length !== 0)
      this.subs.forEach( sub => sub.unsubscribe() );
  }

}
