import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { resolve } from 'dns';
import { IContract } from 'src/app/models/contract';
import { ISpecification } from 'src/app/models/specification';
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
  clientId: number = 0;
  contractId: number = 0;

  contract?: IContract;
  specification: ISpecification[] = [];
  constructor(
    public database: DatabaseService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.clientId = this.activatedRoute.snapshot.params['clientId'];
    this.contractId = this.activatedRoute.snapshot.params['contractId'];

    new Promise((resolve, reject) => {
      this.database
        .getContract(this.clientId, this.contractId)
        .subscribe(({ contract }: any) => {
          this.contract = contract[0];
          resolve(contract);
        });
    })
      .then(() => {
        this.database
          .getFullSpecification(this.clientId, this.contractId)
          .subscribe(({ specification }: any) => {
            this.specification = specification;
          });
      })
      .then(() => {
        setTimeout(() => {
          window.print();
          window.close();
        }, 100);
      });
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
    } catch (exception) {
      return null;
    }
  }

  // Получить сумму заказа по его номеру
  getOrderSum() {
    let sum = 0;

    this.specification.forEach((specification: ISpecification) => {
      // Сумма вычисляется как сумма произведений количество на цену каждой позиции
      sum += specification.Amount * (specification.PriceValue || 0);
    });

    return sum;
  }
}
