import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Interface } from 'readline';
import { DatabaseService } from 'src/app/services/database.service';

interface Order {
  orderId: number;
  Number: string;
  Tin: string;
  OrderDate: Date;
  ReadyDate: Date;
  EmployeeId: number;
}

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  search?: string;
  orderStartDate?: Date;
  orderEndDate?: Date;

  orders: Order[] = [];

  constructor(public database: DatabaseService, private router: Router) {}

  ngOnInit(): void {
    this.database.getOrders().then((result) => {
      this.orders = result;
    });
  }

  createOrder() {
    this.router.navigate(['new-order']);
  }

  changeDate() {
    if ((this.orderStartDate || Date.now) > (this.orderEndDate || Date.now)) {
      alert('Начальная дата не может быть позже конечной');
      this.orderEndDate = this.orderStartDate;
    }
  }
}
