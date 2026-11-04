import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventoService } from '../services/evento.service';
import { Evento } from '../models/evento';
import { ViewChild } from '@angular/core';
import { ListaParticipantesComponent } from '../participantes/lista-participantes/lista-participantes.component';
import { ParticipanteService } from '../services/participante.service';
import { corCategoria } from '../models/categoria';
import { ListaEsperaComponent } from '../participantes/lista-espera/lista-espera.component';
import { ListaEsperaService } from '../services/lista-espera.service';
import { AuthService } from '../services/auth.service';

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
  eventoNaoEncontrado = false;
  baixandoExcel = false;
  mensagemErro = '';
  corCategoria = corCategoria;

  constructor(private route: ActivatedRoute, private eventoService: EventoService, private participanteService: ParticipanteService, private listaEsperaService: ListaEsperaService, public authService: AuthService) {}

  ngOnInit(): void {

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.carregarEvento();
  }

  carregarEvento(){ //Busca o evento (status) e as contagens de participantes e lista de espera
    this.eventoService.buscarPorId(this.id!)
      .subscribe({
        next: resposta => {
          this.evento = resposta;
        },
        error: () => {
          this.eventoNaoEncontrado = true; //Sai do "carregando" e mostra aviso em vez de ficar travado no esqueleto
        }
      });

    this.contarParticipantes(this.id!);
    this.listaEsperaService.contar(this.id!)
      .subscribe({
        next: quantidade => this.quantidadeListaEspera = Number(quantidade),
        error: () => this.quantidadeListaEspera = 0
      });
  }

  atualizarParticipantes(){ //Chamado após inscrição, exclusão ou mudança na fila: tudo pode ter mudado
    this.carregarEvento();
    this.listaParticipantes?.listarParticipantes();
    this.listaEspera?.listar();
  }

  baixar(): void{
    if (this.quantidadeParticipantes === 0) {
      this.mostrarErro('Esse evento não tem participantes para exportar.');
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
      },
      error: async erro => {
        this.baixandoExcel = false;
        //Com responseType 'blob' o corpo do erro também vem como Blob: converte para ler o "titulo" da API
        let titulo = '';
        try {
          titulo = JSON.parse(await (erro.error as Blob).text())?.titulo ?? '';
        } catch (e) {}
        this.mostrarErro(titulo || 'Erro ao baixar o Excel.');
      }
    })
  }

  contarParticipantes(eventoId: number){
    this.participanteService.contarParticipantes(eventoId)
      .subscribe({
        next: resposta => this.quantidadeParticipantes = Number(resposta),
        error: () => this.quantidadeParticipantes = 0
      });
  }

  private mostrarErro(mensagem: string){
    this.mensagemErro = mensagem;
    setTimeout(() => this.mensagemErro = '', 3000);
  }
}