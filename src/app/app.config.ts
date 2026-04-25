import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'; // Agregamos provideZoneChangeDetection si no estaba
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http'; // <-- AGREGAR ESTO

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), // Mejora el rendimiento
    provideRouter(routes),
    provideHttpClient(withFetch()), // <-- ESTO ES LO QUE NECESITAS para usar AuthService
    provideClientHydration(withEventReplay())
  ]
};
