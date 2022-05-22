import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Interface } from 'readline';
import { DatabaseService } from 'src/app/services/database.service';
import { IContract } from '../../models/contract';
import { ISpecification } from 'src/app/models/specification';
import { Order } from 'src/app/models/order';
import { resolve } from 'dns';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  search?: string;
  startDate?: Date;
  endDate?: Date;

  contracts: IContract[] = [];

  constructor(public database: DatabaseService, private router: Router) {}

  ngOnInit(): void {
    // Получение списка договоров
    this.database.getContracts().subscribe(({ contracts }: any) => {
      this.contracts = contracts;

      this.contracts.forEach((contract) => {
        // Promise для составления последовательности:
        // [(1) Заполнить Спецификацию заказа ----> (2) Заполнить сумму по Спецификации ---->
        // (3) Заполнить Заказы ----> [(4)(1) Заполнить Состав заказа ----> (4)(2) Заполнить сумму по Заказу]]
        new Promise((resolve, reject) => {
          // [(1) Заполнение спецификаций договоров
          this.database
            .getSpecification(contract.ClientId, contract.ContractId)
            .subscribe(({ specification }: any) => {
              contract.Specification = specification;
              // Передача заполненной спецификации в следующий then
              resolve(contract.Specification);
            });
        })
          .then((result: any) => {
            // (2) Заполнение суммы договора
            contract.Sum = result.reduce(function (sum: number, current: any) {
              return sum + current.PriceValue * current.Amount;
            }, 0);
          })
          .then(() => {
            // (3) Заполнение заказов
            this.database
              .getOrders(contract.ClientId, contract.ContractId)
              .subscribe(({ orders }: any) => {
                (<Order[]>orders).forEach((order: Order) => {
                  new Promise((resolve, reject) => {
                    // (4)(1) Заполнение состава заказов
                    this.database
                      .getOrderComposition(
                        order.ClientId,
                        order.ContractId,
                        order.OrderId
                      )
                      .subscribe(({ orderComposition }: any) => {
                        order.OrderComposition = orderComposition;
                        resolve(order.OrderComposition);
                      });
                  }).then((result: any) => {
                    // (4)(2) Заполнение суммы заказа]]
                    order.Sum = result.reduce(function (
                      sum: number,
                      current: any
                    ) {
                      return sum + current.PriceValue * current.Amount;
                    },
                    0);
                  });
                });
                contract.Orders = orders;
              });
          });
      });
    });
  }

  viewToggle(item: any) {
    item.UI = { Visible: !item.UI?.Visible };
  }

  createOrder() {
    this.router.navigate(['new-order']);
  }

  changeDate() {
    // Если начальная дата заказа позже конечной,
    if ((this.startDate || Date.now) > (this.endDate || Date.now)) {
      // то предупредить об этом пользователя
      alert('Начальная дата не может быть позже конечной');
      // и установить все даты в начальную
      this.endDate = this.startDate;
    }
  }

  // Отфильтрованный список договоров
  filteredContracts() {
    return this.contracts.filter((contract: IContract) => {
      // Фильтер по номеру договора
      let numberFilter = contract.Number.toUpperCase().startsWith(
        this.search?.toUpperCase() || ''
      );
      // Фильтр по клиентку
      let nameFilter = (contract.Fullname || contract.Name)
        ?.toUpperCase()
        .includes(this.search?.toUpperCase() || '');
      // Фильтр по ИНН клиента
      let INNFilter = contract.INN.toUpperCase().startsWith(
        this.search?.toUpperCase() || ''
      );
      // Фильтра по дате начала действия договора
      let startDateFilter =
        contract.StartDate >= (this.startDate || contract.StartDate);
      // Дата окончания действия договора
      let endDateFilter =
        contract.EndDate <= (this.endDate || contract.EndDate);

      // Фильтр дат должен работать с остальными фильтрами,
      // поэтому он соединён с ними логическим И
      return (
        (numberFilter || nameFilter || INNFilter) &&
        startDateFilter &&
        endDateFilter
      );
    });
  }

  // // Получение позиций заказа по его номеру
  // getOrderPositions(orderId: number) {
  //   return this.positions.filter((position) => position.OrderId == orderId);
  // }

  // // Получить сумму заказа по его номеру
  // getOrderSum(orderId: number) {
  //   let sum = 0;

  //   const positions = this.getOrderPositions(orderId);
  //   positions.forEach((position) => {
  //     // Сумма вычисляется как сумма произведений количество на цену каждой позиции
  //     sum += position.Amount * position.PriceValue;
  //   });

  //   return sum;
  // }

  // // Сменить состояние заказа (свернуть / развернуть)
  // orderActiveToggle(order: Order) {
  //   order.UI = { active: !order.UI?.active };
  // }

  // filteredOrders() {
  //   return this.orders.filter(
  //     (order) =>
  //       (order.OrderDate >= (this.orderStartDate || order.OrderDate) &&
  //         order.OrderDate <= (this.orderEndDate || order.OrderDate) &&
  //         (order.Fullname || order.OrganizationName)?.includes(
  //           this.search || order.Fullname || order.OrganizationName || ''
  //         )) ||
  //       order.Number.startsWith(this.search || order.Number) ||
  //       order.Tin.startsWith(this.search || order.Tin)
  //   );
  // }
}
