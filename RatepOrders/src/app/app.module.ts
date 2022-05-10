import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';
import { AuthPageMenuComponent } from './pages/auth-page/auth-page-menu/auth-page-menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { MenuComponent } from './pages/menu/menu.component';
import { MenuItemComponent } from './pages/menu/menu-item/menu-item.component';
import { NewOrderPageComponent } from './pages/new-order-page/new-order-page.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthPageComponent,
    AuthPageMenuComponent,
    MainPageComponent,
    MenuComponent,
    MenuItemComponent,
    NewOrderPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
