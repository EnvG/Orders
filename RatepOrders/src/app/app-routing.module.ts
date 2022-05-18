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
  { path: 'main', component: MainPageComponent, canActivate: [AuthGuard] },
  {
    path: 'new-order',
    component: NewOrderPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'document/:id',
    component: DocumentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'clients',
    component: ClientsPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'new-client',
    component: NewClientPageComponent,
    canActivate: [AuthGuard],
  },
  //  Страницы Директора
  {
    path: 'products',
    component: ProductsPageComponent,
    canActivate: [DirectorAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
