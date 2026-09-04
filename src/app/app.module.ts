import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventosComponent } from './eventos/eventos.component';
import { ParticipantesComponent } from './participantes/formularioParticipantes/participantes.component';
import { DetalhesEventosComponent } from './detalhes-eventos/detalhes-eventos.component';
import { ListaParticipantesComponent } from './participantes/lista-participantes/lista-participantes.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormularioEventosComponent } from './eventos/formulario-eventos/formulario-eventos.component';
import { FormularioEdicaoEventosComponent } from './eventos/formulario-edicao-eventos/formulario-edicao-eventos.component';
import { LoginComponent } from './login/login.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { CadastroComponent } from './cadastro/cadastro.component';

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
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
