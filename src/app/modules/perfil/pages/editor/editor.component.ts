import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Blog } from 'src/app/interfaces/responses.interface';
import { BlogService } from 'src/app/services/blog.service';
import { ValidService } from 'src/app/services/valid.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styles: [
  ]
})
export class EditorComponent implements OnInit, OnDestroy {

  private subs: Subscription[] = [];

  public blog!: Blog;

  public isLoading: boolean = false;

  public isLoadingPub: boolean = false;

  public formulario: FormGroup = this.formBuilder.group({
    titulo: ['', [Validators.maxLength(50), Validators.minLength(2)]],
    portada: [null, [, this.validService.validExtension]]
  }, {
    validators: [this.validService.notEmpty]
  });

  private portada!: File | null;

  constructor(
    private blogService: BlogService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private validService: ValidService
  ) { }

  ngOnInit(): void {
    const sub1 = this.activatedRoute.params.subscribe({
      next: ({id}) => {

        const sub2 = this.blogService.getBlogByIdAuth(id).subscribe({
          next: resp => {
            if(resp.tokenRenovado)
              localStorage.setItem('token', resp.tokenRenovado);
            this.blog = resp.blog;
          },
          error: error => this.router.navigate(['/home/error'])
        });

        this.subs.push( sub2 );
      }
    });

    this.subs.push( sub1 );
  }

  mensajeError(campo: string, errorType: string): any {
    const field = this.formulario.get(campo);
    if(field?.errors?.[errorType] && field?.touched){
      return true;
    }
    return false;
  }

  updateBorrador() {
    this.isLoading = true;

    const data = new FormData();

    if(this.formulario.get('titulo')?.value && this.formulario.get('titulo')?.value.length > 0)
      data.append('titulo', this.formulario.get('titulo')?.value);
    if(this.portada)
      data.append('portada', this.portada);

    this.formulario.reset();

    const sub = this.blogService.updateBlog(this.blog._id, data).subscribe({
      next: resp => {
        if(resp.tokenRenovado)
          localStorage.setItem('token', resp.tokenRenovado);
        this.blog = resp.blog;
        this.isLoading = false;
      }
    });

    this.subs.push( sub );
  }

  public publicar(): void {
    this.isLoadingPub = true;

    const data = new FormData();
    data.append('publicado', (!this.blog.publicado).toString() );
    const sub = this.blogService.updateBlog(this.blog._id, data).subscribe({
      next: resp => {
        if(resp.tokenRenovado)
          localStorage.setItem('token', resp.tokenRenovado);
        this.blog = resp.blog;
        this.isLoadingPub = false;
      }
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
      this.subs.forEach(sub => sub.unsubscribe());
  }

}
