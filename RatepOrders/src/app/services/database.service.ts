import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
const config = require('../../../server/config/keys');
const URL = config.SERVER.HOST;
const PORT = config.SERVER.PORT;
const ADDRESS = `http://${URL}:${PORT}`;

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(private httpClient: HttpClient) {}

  // Получение всех пользователей из базы данных
  async getUsers() {
    return await this.get('users');
  }

  // Получение всех заказов из базы данных
  async getOrders() {
    return await this.get('orders');
  }

  // Получение позиций заказа по его номеру
  async getOrderPositions(orderId: number) {
    let response = await fetch(`${ADDRESS}/positions?orderId=${orderId}`);

    if (response.ok) {
      let json = await response.json();
      return json.result;
    } else {
      return null;
    }
  }

  // Получение всех изделий из базы данных
  async getProducts() {
    return await this.get('products');
  }

  // Получение всех клиентов из базы данных
  async getClients() {
    return await this.get('clients');
  }

  // Метод get-запроса к серверу
  async get(endpoint: string) {
    let response = await fetch(`${ADDRESS}/${endpoint}`);

    // Если запрос успешно выполнен,
    if (response.ok) {
      // то получить ответ в формате JSON
      let json = await response.json();

      // и вернуть полученный ответ
      return json.result;
    } else {
      // иначе вернуть null
      return null;
    }
  }
}
