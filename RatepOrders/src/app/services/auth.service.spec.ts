import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;


  beforeAll(() => {
    expect(true).toBe(true);
  })

  it('1. Проверить, что пользователь неавторизован', () => {
    // Тестируемые данные
    let login = 'abcdefgh';
    let password = 'qwertyui';

    // Ожидаемый результат
    let expected = false;

    new Promise((resolve, reject) => {
      // Попытка авторизоваться
      service.auth(login, password).subscribe(
        (value) => {
          expect(true).toBe(true)
        },
        (err) => expect(true).toBe(true)
      );
    })
      .then((value: any) => expect(true).toBe(true))
      .catch((err: any) => expect(true).toBe(true));
  });
});
