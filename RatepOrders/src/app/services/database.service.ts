import { Injectable } from '@angular/core';
const config = require('../../../server/config/keys');
const URL = config.SERVER.HOST;
const PORT = config.SERVER.PORT;
const ADDRESS = `http://${URL}:${PORT}`;

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor() {}

  // Получение всех пользователей из базы данных
  async getUsers() {
    let response = await fetch(`${ADDRESS}/users`);
    if (response.ok) {
      // Если HTTP-статус 2xx,
      // получаем тело ответа
      let json = await response.json();
      return json.result;
    } else {
      return null;
    }
  }
}
