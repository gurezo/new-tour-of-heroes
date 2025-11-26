import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { InMemoryDataService } from './app/in-memory-data.service';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(
      HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
        dataEncapsulation: false,
      })
    ),
  ],
}).catch((err) => console.error(err));
