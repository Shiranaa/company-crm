import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login, User } from '../shared/types';
import { ApiService } from './api.service';
import { tap } from 'rxjs/operators';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements CanActivateChild {
  private readonly tokenField = 'token';
  public username = '';
  redirectUrl: string | null = null; // store url for redirecting after login

  constructor(private router: Router, private apiService: ApiService) {
    console.log('AuthService constructor');
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean> {
    console.log('canActivateChild');
    // is the user logged in
    if (this.isLoggedIn()) {
      return true;
    }

    // store the attempted url for redirecting
    this.redirectUrl = state.url;

    return this.router.navigate(['login-component']);
  }

  getUsername() {
    return this.username;
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.tokenField);
    console.log('isLoggedIn', token && token.length > 0 ? true : false);
    return token && token.length > 0 ? true : false;
  }

  login(details: Login): Observable<User> {
    return this.apiService.login(details).pipe(
      tap((data: User) => {
        if (data.token) {
          console.log(data);
          localStorage.setItem(this.tokenField, data.token);
          this.username = data.username;
          this.apiService.setToken(data.token);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenField);
    this.apiService.setToken('');
    this.router.navigate(['login-component']);
  }
}
