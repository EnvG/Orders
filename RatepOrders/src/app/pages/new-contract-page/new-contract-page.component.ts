import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IClient } from 'src/app/models/client';
import { IProduct } from 'src/app/models/product';
import { ISpecification } from 'src/app/models/specification';
import { CookiesService } from 'src/app/services/cookies.service';
import { DatabaseService } from 'src/app/services/database.service';

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
  selector: 'app-new-contract-page',
  templateUrl: './new-contract-page.component.html',
  styleUrls: ['./new-contract-page.component.scss'],
})
export class NewContractPageComponent implements OnInit {
  form: FormGroup = new FormGroup({
    INN: new FormControl(''),
  });

  clients: IClient[] = [];
  products: IProduct[] = [];
  specification: Specification[] = [];
  // Выбранный клиент
  client?: IClient;
  startDate?: Date;
  endDate?: Date;

  constructor(
    private database: DatabaseService,
    private router: Router,
    private cookiesService: CookiesService
  ) {}

  ngOnInit(): void {
    this.database.getClients().subscribe(({ clients }: any) => {
      this.clients = clients;
    });

    this.database.getProducts().subscribe(({ products }: any) => {
      this.products = products;
      this.products.forEach((product: IProduct) => {
        this.specification.push({
          ProductId: product.ProductId,
          ProductName: product.ProductName,
          PriceValue: product.PriceValue,
          Amount: 0,
        });
      });
    });
  }


  getProducts() {
    this.specification.forEach((spec: Specification) => {
      if ((spec.Amount || 0) < 0) {
        spec.Amount = 0;
      }
    });
    return this.specification.filter(
      (specification: Specification) => (specification.Amount || 0) > 0
    );
  }

  getSum() {
    let sum = 0;

    this.getProducts().forEach((product: Specification) => {
      sum += (product.Amount || 0) * (product.PriceValue || 0);
    });

    return sum;
  }

  addContract() {
    let login = this.cookiesService.getCookie('login');
    let body = {
      clientId: this.client?.ClientId,
      login,
      startDate: this.startDate,
      endDate: this.endDate,
      products: this.getProducts(),
    };

    this.database
      .addContract(body)
      .subscribe({
        next: (data) => {
          alert('Договор оформлен');
          this.router.navigate(['main']);
        },
        error: (error) => {
          alert(error.error);
          console.log(error.error);
        },
      });
  }
}
