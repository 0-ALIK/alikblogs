import { Component, OnInit } from '@angular/core';

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
        <a class="tab tab-lifted tab-active bg-base-100/20 backdrop-blur">Login</a>
        <a class="tab tab-lifted">Register</a>
      </div>
      <div class="w-96 h-auto p-4 bg-base-100/20 rounded-xl backdrop-blur max-w-[90%]">
        <h1 class="text-xl text-center">Login</h1>

        <form>
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">Enter your email</span>
            </label>
            <input type="text" placeholder="Type here" class="input input-bordered input-ghost w-full">
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">Enter your password</span>
            </label>
            <input type="password" placeholder="Type here" class="input input-bordered input-ghost w-full">
          </div>

          <button class="btn btn-primary btn-wide mt-8 mx-auto">Iniciar</button>
        </form>
      </div>

    </div>
  `,
  styles: [
  ]
})
export class AuthComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
