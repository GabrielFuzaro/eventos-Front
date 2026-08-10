import { Component, ViewChild } from '@angular/core';
import { EventoService } from '../services/evento.service';
import { Router } from '@angular/router';
import { Evento } from '../models/evento';
import { FormularioEventosComponent } from './formulario-eventos/formulario-eventos.component';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent {

  eventos: Evento[] = []

  constructor(private eventoService: EventoService, private router: Router) {}

  @ViewChild(FormularioEventosComponent)
  formularioEventos!: FormularioEventosComponent;
  
  ngOnInit(){
    this.listarEventos();
  }

  listarEventos(){
    this.eventoService.listarEventos()
    .subscribe((dados: Evento[]) => {
      this.eventos = dados;
    })
  }

  pesquisaEvento = '';
  statusFormulario: boolean = false;

  cadastrarEventoFormulario(){
    this.statusFormulario = !this.statusFormulario;
  }

  abrirEvento(id: number){
    this.router.navigate([
      './eventos',
      id
    ]);
  }

    get eventosFiltrados() {
    return this.eventos.filter(evento =>
      !this.pesquisaEvento ||
      evento.nome.toLowerCase().includes(this.pesquisaEvento.toLowerCase())
    );
  }

  atualizarEventos(){
    this.listarEventos();
  }
}
