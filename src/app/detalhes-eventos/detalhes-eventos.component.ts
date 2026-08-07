import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventoService } from '../services/evento.service';
import { Evento } from '../models/evento';

@Component({
  selector: 'app-detalhes-eventos',
  templateUrl: './detalhes-eventos.component.html',
  styleUrls: ['./detalhes-eventos.component.css']
})
export class DetalhesEventosComponent implements OnInit {

  id?: number;
  evento!: Evento;

  constructor(
    private route: ActivatedRoute,
    private eventoService: EventoService
  ) {}

  ngOnInit(): void {

    this.id = Number(
      this.route.snapshot.paramMap.get('id')
    );


    this.eventoService.buscarPorId(this.id)
      .subscribe(resposta => {
        this.evento = resposta;
      });

  }

}