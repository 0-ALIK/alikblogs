import { AfterViewInit, Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Quill, { QuillOptionsStatic, TextChangeHandler } from 'quill';


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

      this.http.post('https://alik-blogs-backend-production.up.railway.app/upload/subir', formData).subscribe(
        (resp: any) => {
          const { path } = resp;
          const range = this.quillEditor.getSelection();
          this.quillEditor.insertEmbed(range!.index, 'image', path);
        }
      );
    }
  };

  private deleteContents: TextChangeHandler = (delta, oldContents, source) => {
    if(source !== 'user') return;
    console.clear();

    delta.ops.forEach( op => {

      if(op.delete && op.hasOwnProperty('delete') && op.delete > 0) {
        const length = op.delete;
        const start = delta.ops[0].retain || 0;
        const end = start + length;
        const removedOps = oldContents.slice(start, end).ops;

        removedOps.forEach((removedOp) => {
          if (removedOp.insert && removedOp.insert.hasOwnProperty('image')) {
            const a = Object.getOwnPropertyDescriptor(removedOp.insert, 'image')?.value;
            console.log(a);
          }
        });

      }

    });
  };

  // Métodos
  public constructor (
    private http: HttpClient
  ) {}

  public ngAfterViewInit(): void {
    this.quillEditor = new Quill( this.editorRef.nativeElement, this.quillOptions);
    this.toolbar = this.quillEditor.getModule('toolbar');
    this.toolbar.addHandler('image', this.imageHandler);
    this.quillEditor.on('text-change', this.deleteContents);
  }

  public ngOnDestroy(): void {}

}
