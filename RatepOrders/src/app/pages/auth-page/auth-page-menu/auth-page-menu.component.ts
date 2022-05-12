import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth-page-menu',
  templateUrl: './auth-page-menu.component.html',
  styleUrls: ['./auth-page-menu.component.scss'],
})
export class AuthPageMenuComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  helpMessage() {
    alert('Для получения логина и пароля обратитесь к администратору');
  }
}
