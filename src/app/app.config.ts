import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { provideStore } from '@ngrx/store';
import { reducers } from './shared/store/core/app.state';
import { EffectsModule } from '@ngrx/effects';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';

const providersModules = importProvidersFrom(
  EffectsModule.forRoot([]),
  StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideClientHydration(), 
    provideAnimations(), 
    provideHttpClient(), 
    provideStore(reducers),
    provideHttpClient(withFetch()),
    
    providersModules
  ]
};
