import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct } from 'src/app/models/product';
import { ISpecification } from 'src/app/models/specification';

import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-specification-page',
  templateUrl: './specification-page.component.html',
  styleUrls: ['./specification-page.component.scss'],
})
export class SpecificationPageComponent implements OnInit {
  products: IProduct[] = [];
  specification: ISpecification[] = [];
  clientId?: number;
  contractId?: number;
  constructor(
    private database: DatabaseService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clientId = this.activatedRoute.snapshot.params['clientId'];
    this.contractId = this.activatedRoute.snapshot.params['contractId'];

    this.database.getPriceList().subscribe(({ products }: any) => {
      this.products = products;

      products.forEach((product: IProduct) => {
        this.specification.push({
          ClientId: this.clientId || 0,
          ContractId: this.contractId || 0,
          OrdinalNumber: 0,
          ProductName: product.ProductName,
          ProductId: product.ProductId,
          PriceValue: product.PriceValue,
          Amount: 0,
        });
      });
    });
  }

  getSpecificationSum() {
    return this.specification.reduce((sum: number, current: ISpecification) => {
      return sum + (current.PriceValue || 0) * current.Amount;
    }, 0);
  }

  getSpecification() {
    return this.specification.filter(
      (specification: ISpecification) => specification.Amount > 0
    );
  }

  addSpecification() {
    let specification = this.getSpecification();

    this.database.addSpecification(specification).subscribe({
      next: (data) => {
        alert('Спецификация оформлена');
        this.router.navigate(['main']);
      },
      error: (error) => {
        alert(error.error);
        console.log(error.error);
      },
    });
  }
}
