import { Component } from '@angular/core';
import { EventoService } from '../services/evento.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent {

  eventos: any[] = []

  constructor(private eventoService: EventoService) {}
  
  ngOnInit(){
    this.eventoService.listarEventos().subscribe((dados: any) => {
      this.eventos = dados;
    })
  }
}
