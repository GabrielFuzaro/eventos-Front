import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventoService } from '../services/evento.service';
import { Evento } from '../models/evento';
import { ViewChild } from '@angular/core';
import { ListaParticipantesComponent } from '../participantes/lista-participantes/lista-participantes.component';
import { ParticipanteService } from '../services/participante.service';
import { firstValueFrom } from 'rxjs';
import { corCategoria } from '../models/categoria';
import { ListaEsperaComponent } from '../participantes/lista-espera/lista-espera.component';
import { ListaEsperaService } from '../services/lista-espera.service';

@Component({
  selector: 'app-detalhes-eventos',
  templateUrl: './detalhes-eventos.component.html',
  styleUrls: ['./detalhes-eventos.component.css']
})
export class DetalhesEventosComponent implements OnInit {

  @ViewChild(ListaParticipantesComponent)
  listaParticipantes!: ListaParticipantesComponent;

  @ViewChild(ListaEsperaComponent)
  listaEspera?: ListaEsperaComponent;

  id?: number;
  evento!: Evento;
  quantidadeParticipantes: number = 0;
  quantidadeListaEspera: number = 0;
  corCategoria = corCategoria;

  constructor(private route: ActivatedRoute, private eventoService: EventoService, private participanteService: ParticipanteService, private listaEsperaService: ListaEsperaService) {}

  ngOnInit(): void {

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.carregarEvento();
  }

  carregarEvento(){ //Busca o evento (status) e as contagens de participantes e lista de espera
    this.eventoService.buscarPorId(this.id!)
      .subscribe(resposta => {
        this.evento = resposta;
      });

    this.contarParticipantes(this.id!);
    this.listaEsperaService.contar(this.id!)
      .subscribe(quantidade => this.quantidadeListaEspera = Number(quantidade));
  }

  atualizarParticipantes(){ //Chamado após inscrição, exclusão ou mudança na fila: tudo pode ter mudado
    this.carregarEvento();
    this.listaParticipantes?.listarParticipantes();
    this.listaEspera?.listar();
  }

  baixar(): void{
    this.participanteService.baixarExcel(this.evento.id).subscribe({
      next: (arquivo: Blob) => {
        const url = URL.createObjectURL(arquivo);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'participantes.xlsx';
        link.click();
        URL.revokeObjectURL(url);
      }
    })
  }

  async contarParticipantes(eventoId: number){
    const response = await firstValueFrom(this.participanteService.contarParticipantes(eventoId));
    this.quantidadeParticipantes = Number(response)  
  }
}