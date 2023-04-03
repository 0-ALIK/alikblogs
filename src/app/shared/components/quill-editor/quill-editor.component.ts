import { AfterViewInit, Component, ElementRef, ViewChild, OnDestroy, Input, HostListener } from '@angular/core';
import Quill, { QuillOptionsStatic, TextChangeHandler } from 'quill';
import { Subscription } from 'rxjs';
import { Blog } from 'src/app/interfaces/responses.interface';
import { BlogService } from 'src/app/services/blog.service';
import { UploadService } from 'src/app/services/upload.service';


@Component({
  selector: 'app-quill-editor',
  template: `

    <div class="w-full shadow-md rounded-md">
      <div #editor></div>
    </div>
  `
})
export class QuillEditorComponent implements AfterViewInit, OnDestroy {

  // Propiedaded
  // Referencia html del editor
  @ViewChild('editor')
  public editorRef!: ElementRef<HTMLElement>;

  public subs: Subscription[] = [];

  @Input('blog')
  public blog!: Blog

  // Quill editor
  public quillEditor!: Quill;

  // Objeto de configuración de Quill
  public quillOptions: QuillOptionsStatic = {
    modules: {
      toolbar: [
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'align': [] }],
        [{ 'color': [] }, { 'background': [] }],
        ['image']
      ],
    },
    theme: 'snow'
  }

  // Referencia al toolbar de Quill
  public toolbar: any;

  // Handler para la subida de imagenes en Quill
  private imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();

    input.onchange = () => {
      const file = input.files![0];

      const formData = new FormData();
      formData.append('imagen', file);

      const sub = this.uploadService.subirImagen(formData).subscribe({
        next: resp => {
          if(resp.tokenRenovado)
            localStorage.setItem('token', resp.tokenRenovado);
          const { path } = resp;
          const range = this.quillEditor.getSelection();
          this.quillEditor.insertEmbed(range!.index, 'image', path);
        }
      });

      this.subs.push( sub );
    }
  };

  private deleteContents: TextChangeHandler = (delta, oldContents, source) => {
    if(source !== 'user') return;

    delta.ops.forEach( op => {

      if(op.delete && op.hasOwnProperty('delete') && op.delete > 0) {
        const length = op.delete;
        const start = delta.ops[0].retain || 0;
        const end = start + length;
        const removedOps = oldContents.slice(start, end).ops;

        removedOps.forEach((removedOp) => {
          if (removedOp.insert && removedOp.insert.hasOwnProperty('image')) {
            const src = Object.getOwnPropertyDescriptor(removedOp.insert, 'image')?.value;
            const sub = this.uploadService.borrarImagen(src).subscribe({
              next: resp => {
                if(resp.tokenRenovado)
                  localStorage.setItem('token', resp.tokenRenovado);
              }
            });

            this.subs.push( sub );
          }
        });
      }
    });
  };

  // Métodos
  public constructor (
    private uploadService: UploadService,
    private blogService: BlogService
  ) {}

  @HostListener('window:beforeunload', ['$event'])
  public saveData(event: Event): void {
    const data = new FormData();
    data.append('contenido', this.quillEditor.root.innerHTML);

    this.blogService.updateBlog(this.blog._id, data).subscribe({
      next: resp => {
        if(resp.tokenRenovado)
          localStorage.setItem('token', resp.tokenRenovado);
      }
    });
  }

  public ngAfterViewInit(): void {
    this.quillEditor = new Quill( this.editorRef.nativeElement, this.quillOptions);

    if(this.blog)
      this.quillEditor.root.innerHTML = this.blog.contenido;

    this.toolbar = this.quillEditor.getModule('toolbar');
    this.toolbar.addHandler('image', this.imageHandler);
    this.quillEditor.on('text-change', this.deleteContents);
  }

  public ngOnDestroy(): void {

    const data = new FormData();
    data.append('contenido', this.quillEditor.root.innerHTML);

    this.blogService.updateBlog(this.blog._id, data).subscribe({
      next: resp => {
        if(resp.tokenRenovado)
          localStorage.setItem('token', resp.tokenRenovado);
      }
    });

    if (this.subs && this.subs.length !== 0)
      this.subs.forEach(sub => sub.unsubscribe());
  }

}
