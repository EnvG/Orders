import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    login: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(12),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16),
    ]),
  });

  async auth() {
    const { login } = this.authForm.value;
    const { password } = this.authForm.value;

    if (await this.authService.auth(login, password)) {
      alert('Пользователь найден');
    } else {
      alert('Неверный логин или пароль');
    }

    // Сброс введённого пароля
    this.authForm.get('password')?.setValue('');
  }

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}
}
