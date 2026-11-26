import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { corCategoria } from '../models/categoria';
import { Evento, statusEvento } from '../models/evento';
import { ListaEsperaComponent } from '../participantes/lista-espera/lista-espera.component';
import { ListaParticipantesComponent } from '../participantes/lista-participantes/lista-participantes.component';
import { AuthService } from '../services/auth.service';
import { EventoService } from '../services/evento.service';
import { ListaEsperaService } from '../services/lista-espera.service';
import { NotifierService } from '../services/notifier.service';
import { ParticipanteService } from '../services/participante.service';

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
  quantidadeParticipantes = 0;
  quantidadeListaEspera = 0;
  eventoNaoEncontrado = false;
  baixandoExcel = false;
  mostrarModalRota = false;
  corCategoria = corCategoria;
  statusEvento = statusEvento;

  constructor(
    private route: ActivatedRoute,
    private eventoService: EventoService,
    private participanteService: ParticipanteService,
    private listaEsperaService: ListaEsperaService,
    public authService: AuthService,
    private notifier: NotifierService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.carregarEvento();
  }

  carregarEvento(): void {
    this.eventoService.buscarPorId(this.id!)
      .subscribe({
        next: resposta => {
          this.evento = resposta;
        },
        error: () => {
          this.eventoNaoEncontrado = true;
        }
      });

    this.contarParticipantes(this.id!);
    this.listaEsperaService.contar(this.id!)
      .subscribe({
        next: quantidade => this.quantidadeListaEspera = Number(quantidade),
        error: () => this.quantidadeListaEspera = 0
      });
  }

  atualizarParticipantes(): void {
    this.carregarEvento();
    this.listaParticipantes?.listarParticipantes();
    this.listaEspera?.listar();
  }

  baixar(): void {
    if (this.quantidadeParticipantes === 0) {
      this.notifier.aviso('Este evento ainda não possui participantes para exportar');
      return;
    }

    this.baixandoExcel = true;
    this.participanteService.baixarExcel(this.evento.id).subscribe({
      next: (arquivo: Blob) => {
        this.baixandoExcel = false;
        const url = URL.createObjectURL(arquivo);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'participantes.xlsx';
        link.click();
        URL.revokeObjectURL(url);
        this.notifier.sucesso('Planilha gerada');
      },
      error: async erro => {
        this.baixandoExcel = false;
        // Com responseType 'blob' o corpo do erro também vem como Blob: converte para ler o "titulo" da API
        let titulo = '';
        try {
          titulo = JSON.parse(await (erro.error as Blob).text())?.titulo ?? '';
        } catch {}
        this.notifier.erro(titulo || 'Não foi possível gerar o Excel. Tente novamente.');
      }
    });
  }

  get vagasRestantes(): number {
    return this.evento ? Math.max(this.evento.capacidade_maxima - this.quantidadeParticipantes, 0) : 0;
  }

  get percentualOcupacao(): number {
    if (!this.evento || this.evento.capacidade_maxima <= 0) {
      return 0;
    }
    return Math.min(Math.round((this.quantidadeParticipantes / this.evento.capacidade_maxima) * 100), 100);
  }

  contarParticipantes(eventoId: number): void {
    this.participanteService.contarParticipantes(eventoId)
      .subscribe({
        next: resposta => this.quantidadeParticipantes = Number(resposta),
        error: () => this.quantidadeParticipantes = 0
      });
  }
}
