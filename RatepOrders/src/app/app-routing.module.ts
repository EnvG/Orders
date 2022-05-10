import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { NewOrderPageComponent } from './pages/new-order-page/new-order-page.component';

const routes: Routes = [
  { path: '', component: AuthPageComponent },
  { path: 'main', component: MainPageComponent },
  {path: 'new-order', component: NewOrderPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
