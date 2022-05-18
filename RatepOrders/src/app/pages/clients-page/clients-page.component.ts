import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';

interface Client {
  ClientId: number;
  Tin: string;
  Fullname?: string;
  OrganizationName?: string;
  KPP?: string;
  OGRN?: string;
}

@Component({
  selector: 'app-clients-page',
  templateUrl: './clients-page.component.html',
  styleUrls: ['./clients-page.component.scss'],
})
export class ClientsPageComponent implements OnInit {
  search?: string;
  clients: Client[] = [];

  viewPhisycalPersons: boolean = true;
  viewLegalPersons: boolean = true;

  constructor(private database: DatabaseService, private router: Router) {}

  ngOnInit(): void {
    this.database.getClients().then((result: Client[]) => {
      this.clients = result;
    });
  }

  filteredClients() {
    return this.clients.filter(
      (client) =>
        (this.viewPhisycalPersons && client.Fullname) ||
        (this.viewLegalPersons &&
          client.OrganizationName &&
          client.KPP &&
          client.OGRN)
    );
  }

  newClient() {
    this.router.navigate(['new-client']);
  }
}
