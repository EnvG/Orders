import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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

  selectedClientId?: number = undefined;
  readyDate: Date = new Date();

  constructor(
    private database: DatabaseService,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.readyDate.setDate(this.readyDate.getDate() + 1);
    console.log(this.readyDate);

    this.database.getProducts().then((result) => {
      this.products = result.map((product: any) => {
        return {
          ProductId: product.ProductId,
          ProductName: product.ProductName,
          PriceValue: product.PriceValue,
          Amount: 0,
        };
      });
    });

    this.database.getClients().then((result) => {
      this.clients = result;
    });
  }

  createOrder() {
    this.httpClient
      .post(
        `http://localhost:5000/new-order?clientId=${this.selectedClientId}`,
        this.products.filter((product) => product.Amount != 0)
      )
      .subscribe((data: any) => console.log(data));
  }
}
