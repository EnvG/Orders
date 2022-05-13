import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookiesService } from 'src/app/services/cookies.service';
import { DatabaseService } from 'src/app/services/database.service';

interface Product {
  ProductId: number;
  ProductName: string;
  PriceValue: number;
  Amount?: number;
}

interface Client {
  ClientId: number;
  Tin: string;
}

@Component({
  selector: 'app-new-order-page',
  templateUrl: './new-order-page.component.html',
  styleUrls: ['./new-order-page.component.scss'],
})
export class NewOrderPageComponent implements OnInit {
  products: Product[] = [];
  clients: Client[] = [];

  employeeId?: number = undefined;
  selectedClientId?: number = undefined;
  readyDate?: string;

  constructor(
    private database: DatabaseService,
    private httpClient: HttpClient,
    private cookiesService: CookiesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const readyDays = 3;
    // Установить дату готовности заказа на [readyDays] дня(ей)(день) вперёд
    this.readyDate = new Date(Date.now() + readyDays * 24 * 60 * 60 * 1e3)
      .toISOString()
      .split('T')[0];

    // Получение списка изделий из базы данных
    this.database.getProducts().then((result) => {
      // Заполнение списка изделий
      this.products = result.map((product: any) => {
        return {
          ProductId: product.ProductId,
          ProductName: product.ProductName,
          PriceValue: product.PriceValue,
          // Количество по умолчанию равно 0
          Amount: 0,
        };
      });
    });

    // Получение списка клиентов из базы данных
    this.database.getClients().then((result) => {
      // Заполнение клиентов
      this.clients = result;
    });

    // Получение списка пользователей из базы данных
    this.database.getUsers().then((result: any) => {
      const login = this.cookiesService.getCookie('login');

      // Получение ID авторизованного пользователя
      this.employeeId = result.filter(
        (user: any) => user.UserLogin == login
      )[0].UserId;
    });
  }

  getSelectedPositions() {
    return this.products.filter((product) => product.Amount != 0);
  }

  createOrder() {
    // URL-параметры запроса
    const params = {
      clientId: this.selectedClientId,
      employeeId: this.employeeId,
      readyDate: this.readyDate,
    };
    // тело запроса
    const body = {
      positions: this.getSelectedPositions(),
      readyDate: this.readyDate,
    };
    // Запрос на добавление заказа в базу данных
    this.database.post('new-order', body, params).subscribe((data: any) => {
      alert('Заказ оформлен успешно');
      // Возврат на главную страницу
      this.router.navigate(['/main']);
    });
  }
}
