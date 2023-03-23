import { AfterViewInit, Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';import Quill, { QuillOptionsStatic } from 'quill';

@Component({
  selector: 'app-quill-editor',
  template: `

    <div class="w-[32rem] xl:w-[45rem]  mx-auto shadow-md rounded-md">
      <div #editor></div>
    </div>
  `
})
export class QuillEditorComponent implements AfterViewInit, OnDestroy {

  @ViewChild('editor')
  public editor!: ElementRef<HTMLElement>;

  public quillEditor!: Quill;

  public quillOptions: QuillOptionsStatic = {
    modules: {
      toolbar: [
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'align': [] }],
        [{ 'color': [] }, { 'background': [] }],
        ['image']

      ]
    },
    theme: 'snow'
  }

  getContenido(): void {
    console.log(this.quillEditor.getContents());
  }

  getTexto (): void {
    console.log(this.quillEditor.root.innerHTML);
  }

  public ngAfterViewInit(): void {
    this.quillEditor = new Quill( this.editor.nativeElement, this.quillOptions);
  }

  public ngOnDestroy(): void {
    console.log('XDXDXD')
  }

}
