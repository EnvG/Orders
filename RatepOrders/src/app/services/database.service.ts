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

  async getOrders() {
    let response = await fetch(`${ADDRESS}/orders`);

    if (response.ok) {
      let json = await response.json();
      return json.result;
    } else {
      return null;
    }
  }

  async getOrderPositions(orderId: number) {
    let response = await fetch(`${ADDRESS}/positions?orderId=${orderId}`);

    if (response.ok) {
      let json = await response.json();
      return json.result;
      // return JSON.parse(JSON.stringify(json.result)).map((o: any) => {
      //   return {
      //     OrderId: o.OrderId,
      //     Number: o.Number,
      //     OrderDate: o.OrderDate,
      //     ReadyDate: o.ReadyDate,
      //     EmployeeId: o.EmployeeId,
      //     ClientId: o.ClientId,
      //   };
      // });
    } else {
      return null;
    }
  }

  async getProducts() {
    let response = await fetch(`${ADDRESS}/products`);

    if (response.ok) {
      let json = await response.json();
      return json.result;
    } else {
      return null;
    }
  }

  async getClients() {
    let response = await fetch(`${ADDRESS}/clients`);

    if (response.ok) {
      let json = await response.json();
      return json.result;
    } else {
      return null;
    }
  }
}
