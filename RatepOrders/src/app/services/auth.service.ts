import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookiesService } from './cookies.service';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private database: DatabaseService,
    private cookiesService: CookiesService,
    private router: Router
  ) {}

  auth(login: string, password: string) {
    return this.database.auth(login, password);
  }

  checkToken() {
    return this.database.checkToken();
  }

  authorizated() {
    // Значение логина в cookies
    const login = this.cookiesService.getCookie('login');
    const role = this.cookiesService.getCookie('role');

    // Если логин и роль есть,
    // то возвращаем true,
    // иначе — false
    return login.trim() !== '' && role.trim() !== '';
  }

  isManager() {
    let login = this.cookiesService.getCookie('login');
    let role = this.cookiesService.getCookie('role');
    return this.authorizated() && role == '2';
  }

  isDirector() {
    let login = this.cookiesService.getCookie('login');
    let role = this.cookiesService.getCookie('role');
    return this.authorizated() && role == '3';
  }

  logout() {
    this.cookiesService.deleteCookie('login');
    this.cookiesService.deleteCookie('token');
    this.cookiesService.deleteCookie('key')

    this.router.navigate(['/']);
  }
}
