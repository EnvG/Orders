import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { resourceLimits } from 'worker_threads';

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
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
})
export class DocumentComponent implements OnInit {
  order?: Order = undefined;
  positions: Position[] = [];
  constructor(
    public database: DatabaseService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // this.database.getOrders().then(async (orders: Order[]) => {
    //   let orderId = this.activatedRoute.snapshot.params['id'];

    //   this.order = orders.filter((o: Order) => o.OrderId == orderId)[0];
    //   new Promise((resolve, reject) => {
    //     this.database
    //       .getOrderPositions(this.order?.OrderId || 0)
    //       .then((result) => {
    //         this.positions = result;
    //         setTimeout(() => resolve(result), 1);
    //       });
    //   }).then((result) => {
    //     if (!this.order) {
    //       alert('Договор не найден');
    //       document.body.innerHTML = '';
    //     } else {
    //       window.print();
    //       window.close();
    //     }
    //   });
    // });
  }

  getInitials(string: string) {
    try {

      var names = string.split(' '),
      initials = names[0];

      if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
      }
      return `${names[0]} ${names[1].substring(0, 1).toUpperCase()}.${(
        names[2] || ''
        )
        .substring(0, 1)
        .toUpperCase()}`;
      }
      catch (exception) {
        return null;
      }
  }

  // Получить сумму заказа по его номеру
  getOrderSum() {
    let sum = 0;

    this.positions.forEach((position: Position) => {
      // Сумма вычисляется как сумма произведений количество на цену каждой позиции
      sum += position.Amount * position.PriceValue;
    });

    return sum;
  }
}
