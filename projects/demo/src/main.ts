import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { InViewportModule } from '@talentia/angular-in-viewport';
import { AppComponent } from './app/app.component';
import { importProvidersFrom, provideZoneChangeDetection } from '@angular/core';

bootstrapApplication(AppComponent, {
    providers: [
        provideZoneChangeDetection(), 
        importProvidersFrom(BrowserModule, AppRoutingModule, InViewportModule)
    ]
})
.catch(err => console.error(err));
