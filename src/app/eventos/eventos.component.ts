import { Component } from '@angular/core';
import { EventoService } from '../services/evento.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent {

  eventos: any[] = []

  constructor(private eventoService: EventoService, private router: Router) {}
  
  ngOnInit(){
    this.eventoService.listarEventos().subscribe((dados: any) => {
      this.eventos = dados;
    })
  }

  pesquisaEvento = '';

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
}
