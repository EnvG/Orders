import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth.guard';
import { DirectorAuthGuard } from './guards/director-auth.guard';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';
import { ClientsPageComponent } from './pages/clients-page/clients-page.component';
import { DocumentComponent } from './pages/document/document.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { NewClientPageComponent } from './pages/new-client-page/new-client-page.component';
import { NewOrderPageComponent } from './pages/new-order-page/new-order-page.component';
import { ProductsPageComponent } from './pages/products-page/products-page.component';

const routes: Routes = [
  { path: '', component: AuthPageComponent },
  // Страницы Менеджера
  { path: 'main', component: MainPageComponent },
  {
    path: 'new-order',
    component: NewOrderPageComponent,
  },
  {
    path: 'document/:id',
    component: DocumentComponent,
  },
  {
    path: 'clients',
    component: ClientsPageComponent,
  },
  {
    path: 'new-client',
    component: NewClientPageComponent,
  },
  //  Страницы Директора
  {
    path: 'products',
    component: ProductsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
