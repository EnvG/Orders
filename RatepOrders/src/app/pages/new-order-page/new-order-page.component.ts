import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IOrderComposition } from 'src/app/models/orderComposition';
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

interface Specification {
  ClientId?: number;
  ContractId?: number;
  OrdinalNumber?: number;
  ProductId?: number;
  ProductName?: string;
  PriceValue?: number;
  Amount?: number;
}

@Component({
  selector: 'app-new-order-page',
  templateUrl: './new-order-page.component.html',
  styleUrls: ['./new-order-page.component.scss'],
})
export class NewOrderPageComponent implements OnInit {
  products: Product[] = [];
  clients: Client[] = [];
  composition: IOrderComposition[] = [];
  specification: Specification[] = [];

  clientId?: number;
  contractId?: number;

  readyDate?: string;

  constructor(
    private database: DatabaseService,
    private httpClient: HttpClient,
    private cookiesService: CookiesService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.clientId = params.clientId;
      this.contractId = params.contractId;

      if (!(this.clientId && this.contractId)) {
        alert('Клиент или договор не найден');
        this.router.navigate(['/main']);
      }
      this.database
        .getSpecification(this.clientId || -1, this.contractId || -1)
        .subscribe(({ specification }: any) => {
          this.specification = specification;

          this.specification.forEach((spec: Specification) => {
            this.composition.push({
              ClientId: this.clientId || -1,
              ContractId: this.contractId || -1,
              OrdinalNumber: spec.OrdinalNumber || -1,
              ProductId: spec.ProductId || -1,
              ProductName: spec.ProductName || '',
              PriceValue: spec.PriceValue || -1,
              Amount: 0,
              MaxAmount: spec.Amount || 0,
            });
          });
        });
    });
  }

  getOrder() {
    this.composition.forEach((composition: IOrderComposition) => {
      if (composition.Amount < 0) {
        composition.Amount = 0;
      }
      if (composition.Amount > composition.MaxAmount) {
        composition.Amount = composition.MaxAmount;
      }
    });
    return this.composition.filter(
      (composition) =>
        composition.Amount > 0 && composition.Amount <= composition.MaxAmount
    );
  }

  getSum() {
    let sum = 0;

    this.getOrder().forEach((product: Specification) => {
      sum += (product.Amount || 0) * (product.PriceValue || 0);
    });

    return sum;
  }

  createOrder() {
    // тело запроса
    const body = {
      clientId: this.clientId,
      contractId: this.contractId,
      composition: this.getOrder(),
    };

    this.database.addOrder(body).subscribe((value: any) => {
      alert('Заказ оформлен');
        this.router.navigate(['/main']);
    });
  }
}
