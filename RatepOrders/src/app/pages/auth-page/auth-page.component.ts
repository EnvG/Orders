import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
})
export class AuthPageComponent implements OnInit {
  // Форма авторизации
  authForm: FormGroup = new FormGroup({
    // Логин
    // Ограничения: обязательное поле, длина от 5 до 12
    login: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(12),
    ]),
    // Пароль
    // Ограничения: обязательное поле, длина от 5 до 16
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(16),
    ]),
  });

  async auth() {
    // Введённый логин
    const { login } = this.authForm.value;
    // Введённый пароль
    const { password } = this.authForm.value;

    // Авториазация пользователя
    if (await this.authService.auth(login, password)) {
      // Переход на главную страницу
      this.router.navigate(['main']);
    } else {
      alert('Неверный логин или пароль');
    }

    // Сброс введённого пароля
    this.authForm.get('password')?.setValue('');
  }

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}
}
