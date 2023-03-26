import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Blog } from 'src/app/interfaces/responses.interface';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html'
})
export class BlogsComponent implements OnInit, OnDestroy {

  public subs: Subscription[] = [];

  public blogs!: Blog[];

  public cantidad!: number;

  private pagina: number = 0;

  // Llave del localStorage para acceder a la pagina actual
  public storageName: string = 'blogspage';

  get paginas(): number {
    return Math.ceil(this.cantidad / 8);
  }

  constructor(private blogService: BlogService) { }

  ngOnInit(): void {
    this.pagina = Number(localStorage.getItem(this.storageName)) || 0;
    const sub = this.blogService.getBlogs(this.pagina * 8).subscribe({
      next: resp => {
        this.blogs = resp.blogs;
        this.cantidad = resp.cantidad;
      },
      error: error => console.error( error )
    });
    this.subs.push(sub);
  }

  public changePage(page: number): void {
    const sub = this.blogService.getBlogs(page * 8).subscribe({
      next: resp => {
        this.blogs = resp.blogs
        this.cantidad = resp.cantidad;
      },
      error: error => console.error( error )
    });
    this.subs.push( sub );
  }

  ngOnDestroy(): void {
    if(this.subs && this.subs.length !== 0)
      this.subs.forEach(sub => sub.unsubscribe());
  }

}
