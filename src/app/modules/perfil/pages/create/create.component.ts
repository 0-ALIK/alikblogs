import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  public formulario: FormGroup = this.formBuilder.group({
    titulo: ['', [Validators.required,
      Validators.maxLength(50), Validators.minLength(2)]],
    portada: ['', [Validators.required, this.validService.validExtension]]
  });

  constructor(
    private formBuilder: FormBuilder,
    private validService: ValidService,
    private blogService: BlogService
  ) { }

  public mensajeError(campo: string, errorType: string) {
    const field = this.formulario.get(campo);
    if(field?.errors?.[errorType] && field?.touched){
      return true;
    }
    return false;
  }

  public crearBorrador(): void {
    const data = this.formulario.value;

    const sub = this.blogService.crearBlogBorrador(data).subscribe({
      next: resp => {
        console.log('Funciono');
        console.log(resp);
      },
      error: error => console.error( error )
    });

    this.subs.push( sub );
  }

  ngOnDestroy(): void {
    if(this.subs && this.subs.length !== 0)
      this.subs.forEach( sub => sub.unsubscribe() );
  }

}
