import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventosComponent } from './eventos/eventos.component';
import { ParticipantesComponent } from './participantes/formularioParticipantes/participantes.component';
import { DetalhesEventosComponent } from './detalhes-eventos/detalhes-eventos.component';
import { ListaParticipantesComponent } from './participantes/lista-participantes/lista-participantes.component';
import { FormularioEventosComponent } from './eventos/formulario-eventos/formulario-eventos.component';
import { FormularioEdicaoEventosComponent } from './eventos/formulario-edicao-eventos/formulario-edicao-eventos.component';
import { LoginComponent } from './login/login.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { CadastroComponent } from './cadastro/cadastro.component';
import { ListaEsperaComponent } from './participantes/lista-espera/lista-espera.component';
import { AvisoComponent } from './compartilhado/aviso/aviso.component';
import { PaginaNaoEncontradaComponent } from './compartilhado/pagina-nao-encontrada/pagina-nao-encontrada.component';
import { ModalRotaComponent } from './compartilhado/modal-rota/modal-rota.component';
import { NotifierComponent } from './compartilhado/notifier/notifier.component';
import { MinhaContaComponent } from './minha-conta/minha-conta.component';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    EventosComponent,
    ParticipantesComponent,
    DetalhesEventosComponent,
    ListaParticipantesComponent,
    FormularioEventosComponent,
    FormularioEdicaoEventosComponent,
    LoginComponent,
    CadastroComponent,
    ListaEsperaComponent,
    AvisoComponent,
    PaginaNaoEncontradaComponent,
    ModalRotaComponent,
    NotifierComponent,
    MinhaContaComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
