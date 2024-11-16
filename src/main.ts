import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './app/app.routes'; // Onde suas rotas estão definidas

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers, // Importa as configurações já existentes
    importProvidersFrom(RouterModule.forRoot(routes, { useHash: true })) // Adiciona o RouterModule com as rotas
  ]
}).catch((err) => console.error(err));

