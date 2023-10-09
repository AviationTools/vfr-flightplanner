import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { TableComponent } from './table/table.component';
import { HeaderComponent } from './header/header.component';
import { SetupModalComponent } from './setup-modal/setup-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    TableComponent,
    HeaderComponent,
    SetupModalComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    NgbModule,
    LeafletModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
    { path: '', component: HomeComponent, pathMatch: 'full' },
], { relativeLinkResolution: 'legacy' })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
