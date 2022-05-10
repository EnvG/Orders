import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private database: DatabaseService) {}

  // Метод авторизации
  async auth(login: string, password: string) {
    const users = await this.database.getUsers();
    // Пользователь с переданными логином и паролем
    const user = users.filter(
      (u?: any) => u?.UserLogin == login && u?.UserPassword == password
    );

    // Если пользователь существует, то возвращаем true
    return user.length !== 0;
  }
}
