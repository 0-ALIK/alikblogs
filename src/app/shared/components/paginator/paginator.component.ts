import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  template: `
    <div class="w-full flex justify-center py-4">
      <div class="btn-group mx-auto">
        <button class="btn" (click)="cambiarPagina(-1)">«</button>
        <button class="btn">Page {{(currentPage+1) + '/' + paginas}}</button>
        <button class="btn" (click)="cambiarPagina(+1)">»</button>
      </div>
    </div>
  `
})
export class PaginatorComponent implements OnInit {

  @Input('paginas')
  public paginas: number = 0;

  @Input('storageName')
  public storageName: string = '';

  public currentPage: number = 0;

  @Output()
  public changePage: EventEmitter<number> = new EventEmitter();

  public cambiarPagina(change: number): void {
    if( (this.currentPage + change) < 0
        || (this.currentPage + change) > (this.paginas - 1)) {
      return;
    }
    this.currentPage += change;
    localStorage.setItem(this.storageName, JSON.stringify(this.currentPage));
    this.changePage.emit( this.currentPage );
  }

  constructor() { }

  ngOnInit(): void {
    this.currentPage = Number(localStorage.getItem(this.storageName)) || 0;
  }

}
