import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CookiesService {
  constructor() {}

  // Метод получения cookies по имени
  public getCookie(name: string) {
    // Массив значений cookies
    let ca: Array<string> = document.cookie.split(';');
    // Количество cookies
    let caLen: number = ca.length;
    let cookieName = `${name}=`;
    let c: string;

    for (let i: number = 0; i < caLen; i += 1) {
      c = ca[i].replace(/^\s+/g, '');
      // Если найденный cookie соответствует переданному имени,
      if (c.indexOf(cookieName) == 0) {
        // то вернуть его значение
        return c.substring(cookieName.length, c.length);
      }
    }
    return '';
  }

  // Метод удаления cookie по имени
  public deleteCookie(name: string) {
    this.setCookie(name, '', -1);
  }

  // Метод установки cookie
  public setCookie(
    name: string,
    value: string,
    expireDays: number,
    path: string = ''
  ) {
    let d: Date = new Date();
    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
    let expires: string = `expires=${d.toUTCString()}`;
    let cpath: string = path ? `; path=${path}` : '';
    document.cookie = `${name}=${value}; ${expires}${cpath}`;
  }
}
