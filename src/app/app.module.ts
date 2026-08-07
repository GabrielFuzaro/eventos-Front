import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventosComponent } from './eventos/eventos.component';
import { ParticipantesComponent } from './participantes/formularioParticipantes/participantes.component';
import { DetalhesEventosComponent } from './detalhes-eventos/detalhes-eventos.component';
import { ListaParticipantesComponent } from './participantes/lista-participantes/lista-participantes.component';

@NgModule({
  declarations: [
    AppComponent,
    EventosComponent,
    ParticipantesComponent,
    DetalhesEventosComponent,
    ListaParticipantesComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
