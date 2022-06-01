import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { IClient } from '../../models/client';

@Component({
  selector: 'app-clients-page',
  templateUrl: './clients-page.component.html',
  styleUrls: ['./clients-page.component.scss'],
})
export class ClientsPageComponent implements OnInit {
  search?: string;
  clients: IClient[] = [];

  viewPhisycalPersons: boolean = true;
  viewLegalPersons: boolean = true;

  constructor(private database: DatabaseService, private router: Router) {}

  ngOnInit(): void {
    this.database.getClients().subscribe(({ clients }: any) => {
      this.clients = clients;
    });
  }

  filteredClients() {
    return this.clients.filter(
      (client) =>
        (this.viewPhisycalPersons && client.Fullname) ||
        (this.viewLegalPersons &&
          client.Name &&
          client.KPP &&
          client.OGRN)
    );
  }

  newClient() {
    this.router.navigate(['new-client']);
  }
}
