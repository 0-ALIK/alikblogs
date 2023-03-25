import { Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  template: `
    <div class="w-screen h-screen bg-pink-800 flex flex-col items-center ">

      <div class="bg-[url('/assets/wave3.svg')] w-full h-96 bg-no-repeat bg-cover absolute bottom-0">
        <div class="bg-[url('/assets/wave2.svg')] w-full h-96 bg-no-repeat bg-cover">
          <div class="bg-[url('/assets/wave.svg')] w-full h-96 bg-no-repeat bg-cover">

          </div>
        </div>
      </div>

      <div class="px-8 py-4">
        <div class="flex items-center gap-2 p-2 rounded-md">
          <div class="avatar">
            <div class="w-12 rounded-full">
              <img src="assets/logo.png">
            </div>
          </div>
          <div class="text-2xl font-bold">
            BLOGS
          </div>
        </div>
      </div>

      <div class="tabs">
        <a class="tab tab-lg" routerLink="/auth/login" routerLinkActive="tap-active">Login</a>
        <a class="tab tab-lg" routerLink="/auth/register" routerLinkActive="tap-active">Register</a>
      </div>

      <div class="w-96 h-auto p-4 bg-base-100/20 rounded-xl backdrop-blur max-w-[90%]">
        <router-outlet></router-outlet>
      </div>

    </div>
  `,
  styles: [
  ]
})
export class AuthComponent {}
