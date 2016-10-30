import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AppComponent }   from './app.component';
import { AgGridModule } from 'ag-grid-ng2/main';
import { DetailsGridComponent } from "./details-grid.component";

@NgModule({
    imports: [BrowserModule, AgGridModule.withNg2ComponentSupport(), HttpModule],
    declarations: [AppComponent, DetailsGridComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }