import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div class="drawer drawer-mobile">

      <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />

      <div class="drawer-content">
        <app-header class="sticky top-0 z-30 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur transition-all duration-100
  bg-base-100 text-base-content shadow-sm"></app-header>

        <div class="flex p-2 gap-2">

          <div class="basis-full w-full md:w-auto">
            <router-outlet></router-outlet>
          </div>

          <div class="basis-1/2 md:block hidden">
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
