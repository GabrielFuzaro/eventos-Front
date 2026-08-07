import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventosComponent } from './eventos/eventos.component';
import { DetalhesEventosComponent } from './detalhes-eventos/detalhes-eventos.component';
import { ParticipantesComponent } from './participantes/formularioParticipantes/participantes.component';

const routes: Routes = [
  {
    path: 'eventos',
    component: EventosComponent
  },
  {
    path: 'eventos/:id',
    component: DetalhesEventosComponent
  },
   {
    path: '',
    redirectTo: 'eventos',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
