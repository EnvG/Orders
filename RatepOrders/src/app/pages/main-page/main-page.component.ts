import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Interface } from 'readline';
import { DatabaseService } from 'src/app/services/database.service';

interface Order {
  OrderId: number;
  Number: string;
  Tin: string;
  OrderDate: Date;
  ReadyDate: Date;
  EmployeeId: number;
  Fullname?: string;
  OrganizationName?: string;
  UI?: {
    active: boolean;
  };
}

interface Position {
  OrderId: number;
  OrdinalNubmer: number;
  ProductName: string;
  Amount: number;
  PriceValue: number;
}

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  search?: string;
  orderStartDate?: string;
  orderEndDate?: string;

  orders: Order[] = [];
  positions: Position[] = [];

  constructor(public database: DatabaseService, private router: Router) {}

  ngOnInit(): void {
    this.database.post('', null, { clientId: 1, employeeId: 2 });

    // Получение всех заказов из базы данных
    this.database.getOrders().then((result) => {
      // Заполнение заказов
      this.orders = result;

      this.orders.forEach((order: Order) => {
        // Все заказы по умолчанию свёрнуты
        order.UI = { active: false };
        // Заполнение позиций заказа
        this.database.getOrderPositions(order.OrderId).then((positions) => {
          positions.forEach((p: any) => {
            this.positions.push(p);
          });
        });
      });
    });

    this.database.getPostId('qwerty').then((postId: number) => console.log(postId));
  }

  createOrder() {
    this.router.navigate(['new-order']);
  }

  changeDate() {
    // Если начальная дата заказа позже конечной,
    if ((this.orderStartDate || Date.now) > (this.orderEndDate || Date.now)) {
      // то предупредить об этом пользователя
      alert('Начальная дата не может быть позже конечной');
      // и установить все даты в начальную
      this.orderEndDate = this.orderStartDate;
    }
  }

  // Получение позиций заказа по его номеру
  getOrderPositions(orderId: number) {
    return this.positions.filter((position) => position.OrderId == orderId);
  }

  // Получить сумму заказа по его номеру
  getOrderSum(orderId: number) {
    let sum = 0;

    const positions = this.getOrderPositions(orderId);
    positions.forEach((position) => {
      // Сумма вычисляется как сумма произведений количество на цену каждой позиции
      sum += position.Amount * position.PriceValue;
    });

    return sum;
  }

  // Сменить состояние заказа (свернуть / развернуть)
  orderActiveToggle(order: Order) {
    order.UI = { active: !order.UI?.active };
  }

  filteredOrders() {
    return this.orders.filter(
      (order) =>
        (order.OrderDate >= (this.orderStartDate || order.OrderDate) &&
        order.OrderDate <= (this.orderEndDate || order.OrderDate)) &&
        (order.Fullname || order.OrganizationName)?.includes(
          this.search || order.Fullname || order.OrganizationName || ''
        ) ||
        order.Number.startsWith(this.search || order.Number) ||
        order.Tin.startsWith(this.search || order.Tin)
    );
  }
}
