import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {

  @Input() href?: string;
  @Input() title?: string;

  // Нажатие по пункту меню
  itemClick() {
    // Если текущий адрес не совпадает с адресом выбранного меню,
    if (this.router.url != this.href) {
      // то перейти по адресу меню
      this.router.navigate([this.href || this.router.url]);
    }
  }

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}
