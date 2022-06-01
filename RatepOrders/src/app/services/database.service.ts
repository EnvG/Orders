import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISpecification } from '../models/specification';
import { CookiesService } from './cookies.service';
const config = require('../../../server/config/keys');
const URL = config.SERVER.HOST;
const PORT = config.SERVER.PORT;
const ADDRESS = `http://${URL}:${PORT}`;

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(
    private httpClient: HttpClient,
    private cookies: CookiesService
  ) {}

  // Авторизация
  auth(login: string, password: string) {
    return this.httpClient.get(`${ADDRESS}/auth/${login}/${password}`);
  }

  getOrders(clientId: number, contractId: number) {
    return this.httpClient.get(`${ADDRESS}/orders/${clientId}/${contractId}`);
  }

  getOrderComposition(clientId: number, contractId: number, orderId: number) {
    return this.httpClient.get(
      `${ADDRESS}/order-composition/${clientId}/${contractId}/${orderId}`
    );
  }

  checkToken() {
    let token = this.cookies.getCookie('token');
    let login = this.cookies.getCookie('login');
    let key = this.cookies.getCookie('key');
    return this.httpClient.get(
      `${ADDRESS}/check-token/${token}/${login}/${key}`
    );
  }

  // Получение всех пользователей из базы данных
  async getUsers() {
    return await this.get('users');
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
  getProducts() {
    return this.httpClient.get(`${ADDRESS}/price-list`);
  }

  // Получение всех клиентов из базы данных
  getClients() {
    return this.httpClient.get(`${ADDRESS}/clients`);
  }

  addContract(body: any) {
    return this.httpClient.post(`${ADDRESS}/add-contract`, body);
  }

  getPriceList() {
    return this.httpClient.get(`${ADDRESS}/price-list`);
  }

  addSpecification(specification: ISpecification[]) {
    return this.httpClient.post(`${ADDRESS}/add-specification`, specification);
  }

  addOrder(body: any) {
    return this.httpClient.post(`${ADDRESS}/add-order`, body);
  }

  getContract(clientId: number, contractId: number) {
    return this.httpClient.get(`${ADDRESS}/contract/${clientId}/${contractId}`);
  }

  updateProduct(
    productId: number,
    productName: string,
    priceValue: number,
    changeDate: string
  ) {
    return this.httpClient.post(
      `${ADDRESS}/update-product?productId=${productId}&productName=${productName}&priceValue=${priceValue}&changeDate=${changeDate}`,
      null
    );
  }

  addProduct(productName: string, priceValue: number, changeDate: Date) {
    let body = {
      productName: productName,
      priceValue: priceValue,
      changeDate: changeDate.toISOString().split('T')[0],
    };

    return this.post('new-product', body);
  }

  getPostId() {
    let login = this.cookies.getCookie('login');
    return this.httpClient.get(`${ADDRESS}/post-id/${login}`);
  }

  getContracts() {
    return this.httpClient.get(`${ADDRESS}/contracts`);
  }

  getSpecification(clientId: number, contractId: number) {
    return this.httpClient.get(
      `${ADDRESS}/specification/${clientId}/${contractId}`
    );
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

  addPhysicalPersonClient(body: any) {
    return this.post('new-physical-person-client', body);
  }

  addLegalPersonClient(body: any) {
    return this.post('new-legal-person-client', body);
  }

  post(endpoint: string, body: any, params: any = []) {
    let param = '';

    if (params != []) {
      param += '?';
      Object.keys(params).forEach((key: any) => {
        param += `${key}=${params[key]}&`;
      });
    }

    param = param.substring(0, param.length - 1);

    return this.httpClient.post(`${ADDRESS}/${endpoint}${param}`, body);
  }
}
