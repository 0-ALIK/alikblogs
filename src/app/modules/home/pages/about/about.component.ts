import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Blog } from 'src/app/interfaces/responses.interface';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit, OnDestroy {

  public blog!: Blog

  public sub!: Subscription

  constructor(
    private blogService: BlogService
  ) { }

  ngOnInit(): void {

    this.sub = this.blogService.getBlogByID('642ad28cd903e01e992a2408').subscribe({
      next: resp => {
        this.blog = resp.blog;
      }
    })

  }

  ngOnDestroy(): void {
    if(this.sub)
      this.sub.unsubscribe();
  }

}
