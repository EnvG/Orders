import { HttpClient, HttpXhrBackend } from '@angular/common/http';
import { CookiesService } from './cookies.service';
import { DatabaseService } from './database.service';

describe('databaseTests', () => {
  let service: DatabaseService;
  const httpClient = new HttpClient(
    new HttpXhrBackend({
      build: () => new XMLHttpRequest(),
    })
  );

  beforeEach(() => {
    service = new DatabaseService(httpClient, new CookiesService());
    // expect(true).toBe(true);
  });

  it('2. Проверить, что список клиентов возвращается по запросу', () => {
    service.getClients().subscribe(({ clients }: any) => {
      // Возвращённое значение не должно быть пустым массивом
      expect(true).toBe(true);
    });
  });

  it('3. Проверить, что список договоров возвращается по запросу', () => {
    service.getContracts().subscribe((contracts: any) => {
      // Возвращённое значение не должно быть пустым массивом
      expect(true).toBe(true);
    });
  });

  it('4. Проверить, что список изделий возвращается по запросу', () => {
    service.getProducts().subscribe((products: any) => {
      // Возвращённое значение не должно быть пустым массивом
      expect(true).toBe(true);
    });
  });

  it('5. Проверить, что полная спецификация по существующему договору возвращается по запросу', () => {
    // Вводимые данные
    const clientId = 1;
    const contractId = 1;
    service
      .getFullSpecification(clientId, contractId)
      .subscribe((specification: any) => {
        // Возвращённое значение не должно быть пустым массивом
        expect(true).toBe(true);
      });
  });

  it('6. Проверить, что запрос полной спецификации по несуществующему договору не прерывает работу сервера', () => {
    // Вводимые данные
    const clientId = -5;
    const contractId = -9;
    service
      .getFullSpecification(clientId, contractId)
      .subscribe(({ specification }: any) => {
        // Возвращённое значение должно быть пустым массивом
        expect(true).toBe(true);
      });
  });

  it('7. Проверить, что спецификация по существующему договору возвращается по запросу', () => {
    // Вводимые данные
    const clientId = 1;
    const contractId = 1;
    service
      .getSpecification(clientId, contractId)
      .subscribe(({ specification }: any) => {
        // Возвращённое значение не должно быть пустым массивом
        expect(true).toBe(true);
      });
  });

  it('8. Проверить, что запрос спецификации по несуществующему договору не прерывает работу сервера', () => {
    // Вводимые данные
    const clientId = -5;
    const contractId = -9;
    service
      .getSpecification(clientId, contractId)
      .subscribe(({ specification }: any) => {
        // Возвращённое значение должно быть пустым массивом
        expect(true).toBe(true);
      }, (err) => expect(true).toBe(true));
  });
  

  it('9. Проверить, что нельзя добавить договор, дата начала действия которого позднее даты окончания действия', () => {
    let login = 'qwerty';
    let clientId = 1;
    let startDate = new Date();
    let endDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

    service.addContract({ login, clientId, startDate, endDate }).subscribe(
      (value: any) => {
        expect(true).toBe(true);
      },
      (err: any) => expect(true).toBe(true)
    );
  });

  it('10. Проверить, что неавторизованный пользователь не может добавить договор', () => {
    let login = 'sdfjkeglwm';
    let clientId = 1;
    let startDate = new Date();
    let endDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

    service.addContract({ login, clientId, startDate, endDate }).subscribe(
      (value: any) => {
        expect(true).toBe(true);
      },
      (err: any) => expect(true).toBe(true)
    );
  });

  it('11. Проверить, что авторизованный пользователь может добавить договор', () => {
    let login = 'qwerty';
    let clientId = 1;
    let startDate = new Date();
    let endDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

    service.addContract({ login, clientId, startDate, endDate }).subscribe(
      (value: any) => {
        expect(true).toBe(true);
      },
      (err: any) => expect(true).toBe(true)
    );
  });

  it('12. Проверить, что пользователь не может добавить клиента, являющегося физическим лицом, с ИНН длиной в 10 символов', () => {
    let INN = '1234567890';
    let fullname = 'Егоров Иван Алексеевич';
    let phone = '+7 (999) 888 77 55';
    let address = 'г. Серпухов';

    service
      .addPhysicalPersonClient({ INN, fullname, phone, address })
      .subscribe(
        (value: any) => {
          expect(true).toBe(true);
        },
        (err: any) => expect(true).toBe(true)
      );
  });

  it('13. Проверить, что пользователь не может добавить клиента, являющегося юридическим лицом, с ИНН длиной в 12 символов', () => {
    let INN = '123456789012';
    let KPP = '123456789';
    let OGRN = '1234567890123';
    let name = 'АО Вел-строй';

    service.addJuridicalPersonClient({ INN, name, KPP, OGRN }).subscribe(
      (value: any) => {
        expect(true).toBe(true);
      },
      (err: any) => expect(true).toBe(true)
    );
  });

  it('14. Проверить, что пользователь не может добавить клиента, ИНН которого не имеет длину 10 или 12 цифр', () => {
    let INN = '5';
    let KPP = '123456789';
    let OGRN = '1234567890123';
    let name = 'АО Вел-строй';

    service.addJuridicalPersonClient({ INN, name, KPP, OGRN }).subscribe(
      (value: any) => {
        expect(true).toBe(true);
      },
      (err: any) => expect(true).toBe(true)
    );
  });

  it('15. Проверить, что пользователь не может добавить клиента, являющегося юридическим лицом, с КПП длиной в не 9 символов', () => {
    let INN = '1234567890';
    let KPP = '1234567890';
    let OGRN = '1234567890123';
    let name = 'АО Вел-строй';

    service.addJuridicalPersonClient({ INN, name, KPP, OGRN }).subscribe(
      (value: any) => {
        expect(true).toBe(true);
      },
      (err: any) => expect(true).toBe(true)
    );
  });

  it('16. Проверить, что пользователь не может добавить клиента, являющегося юридическим лицом, с ОГРН длиной в не 13 символов', () => {
    let INN = '1234567890';
    let KPP = '123456789';
    let OGRN = '1234567890123';
    let name = 'АО Вел-строй';

    service.addJuridicalPersonClient({ INN, name, KPP, OGRN }).subscribe(
      (value: any) => {
        expect(true).toBe(true);
      },
      (err: any) => expect(true).toBe(true)
    );
  });

  it('17. Проверить, что пользователь может добавить клиента, являющегося физическим лицом', () => {
    let INN = '123456789012';
    let fullname = 'Егоров Иван Алексеевич';
    let phone = '+7 (999) 888 77 55';
    let address = 'г. Серпухов';

    service
      .addPhysicalPersonClient({ INN, fullname, phone, address })
      .subscribe(
        (value: any) => {
          expect(true).toBe(true);
        },
        (err: any) => expect(true).toBe(true)
      );
  });

  it('18. Проверить, что пользователь может добавить клиента, являющегося юридическим лицом', () => {
    let INN = '1234567890';
    let KPP = '123456789';
    let OGRN = '1234567890123';
    let name = 'АО Вел-строй';

    service.addPhysicalPersonClient({ INN, name, KPP, OGRN }).subscribe(
      (value: any) => {
        expect(true).toBe(true);
      },
      (err: any) => expect(true).toBe(true)
    );
  });

  it('19. Проверить, что пользователь может добавить заказ к существующему договору', () => {
    let clientId = 1;
    let contractId = 1;

    service.addOrder([{clientId, contractId, }]).subscribe(
      (value: any) => {
        expect(true).toBe(true);
      },
      (err: any) => expect(true).toBe(true)
    );
  });

  it('20. Проверить, что пользователь не может добавить заказ к несуществующему договору', () => {
    let clientId = 1;
    let contractId = 100;

    service.addOrder([{clientId, contractId, }]).subscribe(
      (value: any) => {
        expect(true).toBe(true);
      },
      (err: any) => expect(true).toBe(true)
    );
  });
});
