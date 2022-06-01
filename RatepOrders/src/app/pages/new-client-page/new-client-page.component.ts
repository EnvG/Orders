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
  public INN?: string = '121212121212';

  // Поля физического лица
  public physicalPerson: {
    fullname: string;
    phone: string;
    address: string;
  } = { fullname: 'Крозар Иван Викторович', phone: '', address: '' };

  constructor(private database: DatabaseService, private router: Router) {}

  ngOnInit(): void {}

  INNValidate() {
    return (
      (this.INN?.length == 10 || this.INN?.length == 12) && Number(this.INN)
    );
  }

  physicalPersonFilled() {
    return (
      this.physicalPerson.phone &&
      this.physicalPerson.address &&
      this.physicalPerson.fullname
    );
  }

  addPhysicalPersonClient() {
    this.database
      .addPhysicalPersonClient({
        INN: this.INN,
        ...this.physicalPerson,
      })
      .subscribe(
        (value: any) => alert(value.message),
        (err: any) => console.log(err)
      );
  }
}
