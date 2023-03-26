import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { map, Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor (
    private usuarioService: UsuarioService,
    private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const token = localStorage.getItem('token');
    if(!token) {
      this.router.navigate(['/']);
      return false;
    }

    return this.usuarioService.verificarAuth(token).pipe(
      map(resp => {
        if(!resp.usuario) {
          this.router.navigate(['/']);
          return false;
        }
        return true;
      })
    );
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {

    const token = localStorage.getItem('token');
    if(!token) {
      this.router.navigate(['/']);
      return false;
    }

    return this.usuarioService.verificarAuth(token).pipe(
      map(resp => {
        if(!resp.usuario) {
          this.router.navigate(['/']);
          return false;
        }
        return true;
      })
    );
  }
}
