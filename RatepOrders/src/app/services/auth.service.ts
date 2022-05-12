import { Injectable } from '@angular/core';
import { CookiesService } from './cookies.service';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private database: DatabaseService,
    private cookiesService: CookiesService
  ) {}

  // Метод авторизации
  async auth(login: string, password: string) {
    const users = await this.database.getUsers();
    // Пользователь с переданными логином и паролем
    const user = users.filter(
      (u?: any) => u?.UserLogin == login && u?.UserPassword == password
    );

    // Если пользователь существует,
    if (user.length !== 0) {
      // то выставить значения cookies и возвратить true
      this.cookiesService.setCookie('login', login, 5);
      return true;
    } else {
      // иначе возвратить false
      return false;
    }
  }

  authorizated() {
    // Значение логина в cookies
    const login = this.cookiesService.getCookie('login');

    // Если логин есть,
    // то возвращаем true,
    // иначе — false
    return login.trim() !== '';
  }
}
