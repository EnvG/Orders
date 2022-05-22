import { Component, OnInit } from '@angular/core';
import { min } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';

interface Product {
  ProductId: number;
  InitProductName?: string;
  ProductName: string;
  initPriceValue?: number;
  PriceValue: number;
  ChangeDate: Date;
}

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss'],
})
export class ProductsPageComponent implements OnInit {
  products: Product[] = [];
  minDay: Date = new Date();

  constructor(private database: DatabaseService, private authService: AuthService) {}

  ngOnInit(): void {
    this.database.getProducts().then((result: any[]) => {
      this.products = result.map<Product>((value: any) => {
        return {
          ProductId: value.ProductId,
          InitProductName: value.ProductName,
          ProductName: value.ProductName,
          initPriceValue: value.PriceValue,
          PriceValue: value.PriceValue,
          ChangeDate: value.changeDate,
        };
      });
    });

    this.minDay.setDate(this.minDay.getDate() + 2);
  }

  save(product: Product) {
    if (product.ProductId !== 0) {
      if (
        product.PriceValue != (product.initPriceValue || product.PriceValue)
      ) {
        alert(
          `Изменения будут приняты ${this.minDay.toLocaleDateString()}: ${
            product.initPriceValue
          } ---> ${product.PriceValue}`
        );
      }

      this.database
        .updateProduct(
          product.ProductId,
          product.ProductName,
          product.PriceValue,
          this.minDay.toISOString().split('T')[0]
        )
        .subscribe((result) => console.log(result));
    } else {
      this.database
        .addProduct(product.ProductName, product.PriceValue, new Date())
        .subscribe((value) => console.log(value));
    }
    product.initPriceValue = product.PriceValue;
  }

  new() {
    this.products.push({
      ProductId: 0,
      ProductName: 'Наименование изделия',
      PriceValue: 0,
      ChangeDate: new Date(),
    });
  }

  logout() {
    if (confirm('Вы действительно хотите выйти?')) {
      this.authService.logout();
    }
  }
}
