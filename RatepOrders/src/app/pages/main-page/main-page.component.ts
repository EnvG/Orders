import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Interface } from 'readline';
import { DatabaseService } from 'src/app/services/database.service';
import { IContract } from '../../models/contract';
import { ISpecification } from 'src/app/models/specification';
import { IOrder } from 'src/app/models/order';
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
                (<IOrder[]>orders).forEach((order: IOrder) => {
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

  toNewContractPage() {
    this.router.navigate(['new-contract']);
  }

  toSpecificationPage(clientId: number, contractId: number) {
    this.router.navigate([`specification/${clientId}/${contractId}`]);
  }

  toNewOrderPage(clientId: number, contractId: number) {
    this.router.navigate([`new-order/${clientId}/${contractId}`]);
  }

  setOrderStatus(
    clientId: number,
    contractId: number,
    orderId: number,
    statusId: number
  ) {
    this.database
      .setOrderStatus({ clientId, contractId, orderId, statusId })
      .subscribe(
        (value) => {
          alert('Статус заказа изменён');
          location.reload();
        },
        (err) => alert(err.error.sqlMessage)
      );
  }
  setContractStatus(
    orders: any,
    clientId: number,
    contractId: number,
    statusId: number
  ) {
    new Promise((resolve, reject) => {
      orders.forEach((order: IOrder) => {
        if (order.StatusId != 4) {
          reject();
          return;
        }
      });
      resolve(statusId);
    })
      .then((value) => {
        this.database
          .setContractStatus({ clientId, contractId, statusId })
          .subscribe(
            (value) => {
              alert('Статус договора изменён');
              location.reload();
            },
            (err) => alert(err.error.sqlMessage)
          );
      })
      .catch(() =>
        alert(
          'Для закрытия договора требуется выдать все заказы по данному договору'
        )
      );
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
}
