import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventosComponent } from './eventos/eventos.component';
import { DetalhesEventosComponent } from './detalhes-eventos/detalhes-eventos.component';
import { FormularioEdicaoEventosComponent } from './eventos/formulario-edicao-eventos/formulario-edicao-eventos.component';
import { LoginComponent } from './login/login.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { PaginaNaoEncontradaComponent } from './compartilhado/pagina-nao-encontrada/pagina-nao-encontrada.component';
import { MinhaContaComponent } from './minha-conta/minha-conta.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    canActivate: [AuthGuard],
    path: 'eventos',
    component: EventosComponent
  },
  {
    canActivate: [AuthGuard],
    path: 'minha-conta',
    component: MinhaContaComponent
  },
  {
    canActivate: [AuthGuard],
    path: 'eventos/:id',
    component: DetalhesEventosComponent
  },
  {
    canActivate: [AuthGuard],
    path: 'eventos/:id/edicao',
    component: FormularioEdicaoEventosComponent,
    data: { role: 'ADMIN' }
  },
  {
    canActivate: [AuthGuard],
    path: 'eventos/:id/edição',
    component: FormularioEdicaoEventosComponent,
    data: { role: 'ADMIN' }
  },
  {
    path: '',
    redirectTo: 'eventos',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    component: LoginComponent
  },
  {
    path: 'auth/cadastro',
    component: CadastroComponent
  },
  {
    path: '**',
    component: PaginaNaoEncontradaComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
