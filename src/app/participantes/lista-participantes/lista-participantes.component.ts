import { Component, OnChanges } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { Participante } from 'src/app/models/participante';
import { ParticipanteService } from 'src/app/services/participante.service';
import { Input } from '@angular/core';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-lista-participantes',
  templateUrl: './lista-participantes.component.html',
  styleUrls: ['./lista-participantes.component.css']
})
export class ListaParticipantesComponent implements OnChanges{

  constructor(private participantesService: ParticipanteService, private route: ActivatedRoute, private eventoServices: EventoService) {}

  participantes: Participante[] = [];

  ngOnChanges(){
    if(this.eventoId){

        this.listarParticipantes();

    }
}

  @Input()
  eventoId!: number

  listarParticipantes(){
    this.eventoServices.listarParticipantesEvento(this.eventoId)
    .subscribe({
      next: resposta => {
        console.log(resposta);
        this.participantes = resposta as Participante[];
      },
      error: erro => {
        console.log("Erro ao buscar participantes", erro)
      }
    });
  }
}
