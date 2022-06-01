import { LowerCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CookiesService } from 'src/app/services/cookies.service';
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

  public get login(): AbstractControl | null {
    return this.authForm.get('login');
  }

  public get password(): AbstractControl | null {
    return this.authForm.get('password');
  }

  async auth() {
    // Введённый логин
    const login = this.login?.value;
    // Введённый пароль
    const password = this.password?.value;

    this.database.auth(login, password).subscribe(
      (result: any) => {
        if (result) {
          let { token } = result;
          let { key } = result;

          // Установка cookies
          this.cookiesService.setCookie('token', token, 30);
          this.cookiesService.setCookie('key', key, 30);
          this.cookiesService.setCookie('login', login, 30);

          // Переход на следующую страницу
          this.nextPage();
        } else {
          alert('Неверный логин или пароль');
        }
      },
      (err) => {
        alert('Ошибка сервера. Обратитесь к администратору');
      }
    );

    // Сброс введённого пароля
    this.password?.setValue('');
  }

  constructor(
    private authService: AuthService,
    private cookiesService: CookiesService,
    private database: DatabaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.checkToken().subscribe(({ access }: any) => {
      if (Boolean(access)) {
        this.nextPage();
      }
    });
  }

  nextPage() {
    // Перенаправление
    this.database.getPostId().subscribe(({ postId }: any) => {
      switch (postId.toString()) {
        case '2':
          this.router.navigate(['/main']);
          break;
        case '3':
          this.router.navigate(['/products']);
          break;
      }
    });
  }
}
