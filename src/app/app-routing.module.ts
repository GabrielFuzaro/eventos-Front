import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventosComponent } from './eventos/eventos.component';
import { DetalhesEventosComponent } from './detalhes-eventos/detalhes-eventos.component';
import { FormularioEdicaoEventosComponent } from './eventos/formulario-edicao-eventos/formulario-edicao-eventos.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [ //Declara as rotas para exibir as páginas
  {
    path: 'eventos',
    component: EventosComponent
  },
  {
    path: 'eventos/:id',
    component: DetalhesEventosComponent
  },
  {
    path: 'eventos/:id/edição',
    component: FormularioEdicaoEventosComponent
  },
   {
    path: '',
    redirectTo: 'eventos',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
