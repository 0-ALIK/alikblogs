import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div class="drawer drawer-mobile">

      <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />

      <div class="drawer-content">
        <app-header></app-header>

        <div class="flex p-4 gap-2">

          <div class="bg-pink-500 basis-full">
            <router-outlet></router-outlet>
          </div>

          <div class="bg-pink-700 basis-1/3">
            <app-aside></app-aside>
          </div>

        </div>

      </div>

      <div class="drawer-side">
        <label for="my-drawer-2" class="drawer-overlay"></label>
        <app-sidebar class="w-60"></app-sidebar>
      </div>

    </div>
  `,
  styles: [
  ]
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
