import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { LocalizarComponent } from './localizar/localizar.component';
import { SobreComponent } from './sobre/sobre.component';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { NotebooksComponent } from './localizar/notebooks/notebooks.component';
import { PilhasComponent } from './localizar/pilhas/pilhas.component';
import { ImpressorasComponent } from './localizar/impressoras/impressoras.component';
import { BateriasComponent } from './localizar/baterias/baterias.component';
import { LampadasComponent } from './localizar/lampadas/lampadas.component';
import { CelularesComponent } from './localizar/celulares/celulares.component';

export const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent},
  { path: 'localizar', component: LocalizarComponent},
  { path: 'sobre', component: SobreComponent},
  { path: 'localizar/notebooks', component: NotebooksComponent},
  { path: 'localizar/pilhas', component: PilhasComponent},
  { path: 'localizar/impressoras', component: ImpressorasComponent},
  { path: 'localizar/baterias', component: BateriasComponent},
  { path: 'localizar/lampadas', component: LampadasComponent},
  { path: 'localizar/celulares', component: CelularesComponent}
];

export const routing: ModuleWithProviders<NgModule> = RouterModule.forRoot(routes, {useHash: true});

