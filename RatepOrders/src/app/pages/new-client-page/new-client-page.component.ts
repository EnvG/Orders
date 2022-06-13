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
  public KPPMask = Array(9).fill(/\d/, 0);
  // Маска ОГРН
  public OGRNMask = Array(13).fill(/\d/, 0);

  // Общие поля
  // ИНН
  public INN?: string = '';

  // Поля физического лица
  public physicalPerson: {
    fullname: string;
    phone: string;
    address: string;
  } = { fullname: '', phone: '', address: '' };

  // Поля юридического лица
  public juridicalPerson: {
    name: string;
    KPP: string;
    OGRN: string;
  } = { name: '', KPP: '', OGRN: '' };

  constructor(private database: DatabaseService, private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      console.log(this.physicalPerson.phone.length);
    }, 20000);
  }

  INNValidate() {
    return (
      (this.INN?.trim().length == 10 || this.INN?.trim().length == 12) &&
      Number(this.INN)
    );
  }

  physicalPersonFilled() {
    return (
      this.physicalPerson.phone &&
      !this.physicalPerson.phone.includes('_') &&
      this.physicalPerson.address &&
      this.physicalPerson.fullname
    );
  }

  juridicalPersonFilled() {
    return (
      this.juridicalPerson.name &&
      this.juridicalPerson.KPP &&
      !this.juridicalPerson.KPP.includes('_') &&
      this.juridicalPerson.OGRN &&
      !this.juridicalPerson.OGRN.includes('_')
    );
  }

  addPhysicalPersonClient() {
    this.database
      .addPhysicalPersonClient({
        INN: this.INN,
        ...this.physicalPerson,
      })
      .subscribe(
        (value: any) => {
          alert(value.message);
          location.href = '/clients';
        },
        (err: any) => {
          alert('Ошибка добавления');
          console.log(err);
        }
      );
  }

  addJuridicalPersonClient() {
    this.database
      .addJuridicalPersonClient({
        INN: this.INN,
        ...this.juridicalPerson,
      })
      .subscribe(
        (value: any) => {
          alert(value.message);
          location.href = '/clients';
        },
        (err: any) => {
          alert('Ошибка добавления');
          console.log(err);
        }
      );
  }
}
