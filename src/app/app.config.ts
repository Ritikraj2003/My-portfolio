import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { routes } from './app.routes';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      RouterModule,
      CommonModule,
      HttpClientModule,
      BrowserAnimationsModule
    ),
    provideAnimations()
  ]
};
