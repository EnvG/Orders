import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TextMaskModule } from 'angular2-text-mask';
import { DatabaseService } from 'src/app/services/database.service';
import { setInterval } from 'timers';
import { InputType } from 'zlib';

@Component({
  selector: 'app-new-client-page',
  templateUrl: './new-client-page.component.html',
  styleUrls: ['./new-client-page.component.scss'],
})
export class NewClientPageComponent implements OnInit {
  // Общая форма
  form: FormGroup = new FormGroup({
    tin: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(12),
      Validators.pattern(/^\d+$/),
    ]),
    address: new FormControl('', [Validators.required]),
    seria: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(4),
      Validators.pattern(/\d{4}/),
    ]),
    number: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
      Validators.pattern(/\d{6}/),
    ]),
    issueDate: new FormControl('', [Validators.required]),
    issuedBy: new FormControl('', [Validators.required]),
  });

  // Форма Физических лиц
  physicalPersonForm: FormGroup = new FormGroup({
    fullname: new FormControl('', [Validators.required]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\+[7]{1}\s\([9]{1}\d{2}\)\s\d{3}\s\d{2}\s\d{2}$/),
    ]),
  });

  // Форма Юридических лиц
  legalPersonForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    trrc: new FormControl('', [
      Validators.required,
      Validators.minLength(9),
      Validators.maxLength(9),
    ]),
    psrn: new FormControl('', [
      Validators.required,
      Validators.minLength(13),
      Validators.maxLength(13),
    ]),
  });

  // Маска телефона
  public phoneMask = [
    '+',
    '7',
    ' ',
    '(',
    '9',
    /\d/,
    /\d/,
    ')',
    ' ',
    /\d/,
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
  ];
  // Маска КПП
  public trrcMask = Array(9).fill(/\d/, 0);
  // Маска ОГРН
  public psrnMask = Array(13).fill(/\d/, 0);
  // Маска для серии паспорта
  public seriaMask = Array(4).fill(/\d/, 0);
  // Маска для номера паспорта
  public numberMask = Array(6).fill(/\d/, 0);

  constructor(private database: DatabaseService, private router: Router) {}

  ngOnInit(): void {}

  tinChanged(e: KeyboardEvent) {
    if (
      ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace'].includes(
        e.key
      )
    )
      if (this.physicalPersonForm.dirty || this.legalPersonForm.dirty) {
        if (
          confirm(
            'Изменение ИНН приведёт к очистке заполненных полей. Вы уверены, что хотите изменить ИНН?'
          )
        ) {
          this.physicalPersonForm.reset();
          this.legalPersonForm.reset();
        } else {
          e.preventDefault();
        }
      }
  }

  isPhysicalPerson() {
    return this.form.get('tin')?.value?.length == 12;
  }

  isLegalPerson() {
    return this.form.get('tin')?.value?.length == 10;
  }

  addClient() {
    if (this.isPhysicalPerson()) {
      let INN = this.form.get('tin')?.value;

      let fullname = this.physicalPersonForm.get('fullname')?.value;
      let phone = this.physicalPersonForm.get('phone')?.value;
      let address = this.form.get('address')?.value;
      let passport = {
        seria: this.form.get('seria')?.value,
        number: this.form.get('number')?.value,
        issueDate: this.form.get('issueDate')?.value,
        issuedBy: this.form.get('issuedBy')?.value,
      };

      let body = {
        INN: INN,
        fullname: fullname,
        phone: phone,
        address: address,
        passport: passport,
      };

      this.database.addPhysicalPersonClient(body).subscribe(
        (result) => {
          alert('Клиент успешно добавлен');
          this.router.navigate(['/main']);
        },
        (error) => {
          alert('Ошибка добавления клиента');
        }
      );
    }
    else if (this.isLegalPerson()) {
      let INN = this.form.get('tin')?.value;
      let KPP = this.legalPersonForm.get('trrc')?.value;
      let OGRN = this.legalPersonForm.get('psrn')?.value;
      let name: string = this.legalPersonForm.get('name')?.value;

      let address = this.form.get('address')?.value;
      let passport = {
        seria: this.form.get('seria')?.value,
        number: this.form.get('number')?.value,
        issueDate: this.form.get('issueDate')?.value,
        issuedBy: this.form.get('issuedBy')?.value,
      };

      let body = {
        INN: INN,
        KPP: KPP,
        OGRN: OGRN,
        address: address,
        organizationName: name.replace(/"/g, "'"),
        passport: passport,
      };

      this.database.addLegalPersonClient(body).subscribe(
        (result) => {
          alert('Клиент успешно добавлен');
          this.router.navigate(['/main']);
        },
        (error) => {
          alert('Ошибка добавления клиента');
        }
      );
    }
  }
}
